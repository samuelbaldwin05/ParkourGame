const GameManager = {
    // Game state
    scene: null,
    camera: null,
    renderer: null,
    player: null,
    inMenu: true,
    
    // Game variables
    keys: {},
    mouseX: 0,
    mouseY: 0,
    velocity: new THREE.Vector3(),
    canJump: false,
    isOnGround: false,
    isSprinting: false,
    
    // Course data
    blocks: [],
    checkpoints: [],
    currentCheckpoint: 0,
    startTime: Date.now(),
    fallCount: 0,
    gameCompleted: false,
    currentCourse: null,
    spawnRotation: [0, 0], // [horizontal degrees, vertical degrees]
    
    // Progress system
    unlockedLevels: ['training'], // Start with training unlocked
    completedLevels: [],
    
    // Available courses
    courses: {
        training: TrainingCourse,
        intermediate: IntermediateCourse,
        expert: ExpertCourse,
        insane: InsaneCourse
    },
    
    // Block materials
    materials: {
        normal: new THREE.MeshLambertMaterial({ 
            color: 0x4a5568,
            emissive: 0x0a0a1a,
            emissiveIntensity: 0.1
        }),
        start: new THREE.MeshLambertMaterial({ 
            color: 0x00ff88,
            emissive: 0x003322,
            emissiveIntensity: 0.3
        }),
        checkpoint: new THREE.MeshLambertMaterial({ 
            color: 0x00d4ff,
            emissive: 0x002244,
            emissiveIntensity: 0.3
        }),
        end: new THREE.MeshLambertMaterial({ 
            color: 0xffaa00,
            emissive: 0x442200,
            emissiveIntensity: 0.4
        }),
        slime: new THREE.MeshLambertMaterial({ 
            color: 0x00ff88,
            transparent: true,
            opacity: 0.8,
            emissive: 0x004422,
            emissiveIntensity: 0.5
        })
    },

    // Helper function to convert degrees to radians
    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    },

    init() {
        this.setupScene();
        this.loadProgress();
        this.updateMenuLevels();
        this.setupEventListeners();
        this.animate();
    },

    setupScene() {
        // Create scene
        this.scene = new THREE.Scene();
        // this.scene.fog = new THREE.Fog(0x000011, 20, 100);  
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 2.8, 0);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas'), antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // Set space background color
        this.renderer.setClearColor(0x000011);

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x2a3f5f, 0.4);  
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(30, 40, 30);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        this.scene.add(directionalLight);
        Skybox.create(this.scene);

        // Create player collision cylinder
        const playerGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.8, 8);
        const playerMaterial = new THREE.MeshBasicMaterial({ visible: false });
        this.player = new THREE.Mesh(playerGeometry, playerMaterial);
        this.player.position.set(0, 1.9, 0);
        this.scene.add(this.player);
    },

    loadProgress() {
        const saved = localStorage.getItem('parkour_progress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.unlockedLevels = progress.unlocked || ['training'];
            this.completedLevels = progress.completed || [];
        }
    },

    saveProgress() {
        const progress = {
            unlocked: this.unlockedLevels,
            completed: this.completedLevels
        };
        localStorage.setItem('parkour_progress', JSON.stringify(progress));
    },

    updateMenuLevels() {
        const levelOrder = ['training', 'intermediate', 'expert', 'insane'];
        
        levelOrder.forEach((levelName, index) => {
            const levelElement = document.getElementById(levelName === 'training' ? 'trainingLevel' : levelName + 'Level');
            if (levelElement) {
                if (this.unlockedLevels.includes(levelName)) {
                    levelElement.classList.remove('locked');
                    levelElement.classList.add('unlocked');
                    levelElement.querySelector('.level-status').textContent = 
                        this.completedLevels.includes(levelName) ? 'COMPLETED' : 'AVAILABLE';
                    levelElement.onclick = () => this.startLevel(levelName);
                } else {
                    levelElement.classList.add('locked');
                    levelElement.classList.remove('unlocked');
                    levelElement.onclick = null;
                }
            }
        });
        
        // Update training level specifically
        const trainingItem = document.querySelector('.level-item');
        if (this.completedLevels.includes('training')) {
            trainingItem.querySelector('.level-status').textContent = 'COMPLETED';
        }
    },

    startLevel(levelName) {
        if (!this.unlockedLevels.includes(levelName)) return;
        
        this.inMenu = false;
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('gameUI').style.display = 'block';
        document.body.classList.add('game-active');
        
        this.loadCourse(this.courses[levelName]);
        this.resetGame();
        
        // Auto-lock cursor after a brief delay
        setTimeout(() => {
            document.body.requestPointerLock();
        }, 100);
    },

    returnToMenu() {
        this.inMenu = true;
        document.getElementById('mainMenu').style.display = 'flex';
        document.getElementById('gameUI').style.display = 'none';
        document.getElementById('completionMessage').style.display = 'none';
        document.body.classList.remove('game-active');
        
        // Release pointer lock
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
        
        this.updateMenuLevels();
    },

    loadCourse(course) {
        // Clear existing blocks
        this.blocks.forEach(block => this.scene.remove(block));
        this.blocks = [];
        this.checkpoints = [];
        
        this.currentCourse = course;
        
        // Set course info
        document.getElementById('courseName').textContent = course.name;
        document.getElementById('totalCheckpoints').textContent = course.totalCheckpoints;
        
        // Build course from layout
        course.layout.forEach(item => {
            if (item.type === 'platform') {
                this.createPlatform(item.pos[0], item.pos[1], item.pos[2], item.size[0], item.size[1], item.material);
            } else if (item.type === 'block') {
                this.createBlock(item.pos[0], item.pos[1], item.pos[2], item.material);
            }
        });
        
        // Set checkpoints with rotation support
        course.checkpoints.forEach(cp => {
            const checkpoint = {
                position: new THREE.Vector3(cp.pos[0], cp.pos[1], cp.pos[2]),
                rotation: cp.rotation || [0, 0] // Default to facing north, level
            };
            this.checkpoints.push(checkpoint);
        });
        
        // Set spawn rotation
        this.spawnRotation = course.spawnRotation || [0, 0]; // Default facing north, level
    },

    createBlock(x, y, z, type) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const mesh = new THREE.Mesh(geometry, this.materials[type]);
        
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        mesh.userData = {
            type: type,
            isSlime: type === 'slime',
            isCheckpoint: type === 'checkpoint' || type === 'start' || type === 'end'
        };
        
        this.scene.add(mesh);
        this.blocks.push(mesh);
        
        return mesh;
    },

    createPlatform(x, y, z, width, depth, type) {
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < depth; j++) {
                this.createBlock(x + i, y, z + j, type);
            }
        }
    },

    updatePlayer() {
        if (this.gameCompleted || this.inMenu) return;

        // Handle sprinting
        this.isSprinting = this.keys['ShiftLeft'] || this.keys['ShiftRight'];
        
        // Movement input
        let moveVector = new THREE.Vector3();
        if (this.keys['KeyW']) moveVector.z -= 1;
        if (this.keys['KeyS']) moveVector.z += 1;
        if (this.keys['KeyA']) moveVector.x -= 1;
        if (this.keys['KeyD']) moveVector.x += 1;

        // Apply movement
        if (moveVector.length() > 0) {
            moveVector.normalize();
            moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.mouseX);
            
            const baseSpeed = this.isSprinting ? 0.009 : 0.006;
            const movementSpeed = this.isOnGround ? baseSpeed : baseSpeed * 0.08;
            
            this.velocity.x += moveVector.x * movementSpeed;
            this.velocity.z += moveVector.z * movementSpeed;
        }

        // Jumping
        if (this.keys['Space'] && this.canJump) {
            this.velocity.y = 0.095;
            this.canJump = false;
            this.isOnGround = false;
        }

        // Apply gravity
        this.velocity.y += -0.0012;

        // Apply friction and air resistance
        if (this.isOnGround) {
            this.velocity.x *= 0.82;
            this.velocity.z *= 0.82;
        } else {
            this.velocity.x *= 0.99;
            this.velocity.z *= 0.99;
        }

        this.checkCollisions();
        this.updateCamera();
        this.updateUI();
    },

    checkCollisions() {
        const futurePosition = this.player.position.clone().add(this.velocity);
        let onGround = false;
        let onSlime = false;

        // Check collision with each block
        this.blocks.forEach(block => {
            const blockBox = new THREE.Box3().setFromObject(block);
            const playerBox = new THREE.Box3().setFromCenterAndSize(
                futurePosition,
                new THREE.Vector3(0.6, 1.8, 0.6)
            );

            if (blockBox.intersectsBox(playerBox)) {
                const blockCenter = new THREE.Vector3();
                blockBox.getCenter(blockCenter);
                
                const dx = futurePosition.x - blockCenter.x;
                const dy = futurePosition.y - blockCenter.y;
                const dz = futurePosition.z - blockCenter.z;
                
                // Vertical collision
                if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > Math.abs(dz)) {
                    if (dy > 0) {
                        futurePosition.y = blockBox.max.y + 0.9;
                        this.velocity.y = 0;
                        onGround = true;
                        this.canJump = true;
                        
                        if (block.userData.isSlime) onSlime = true;
                        this.checkCheckpoint(futurePosition);
                    } else {
                        futurePosition.y = blockBox.min.y - 0.9;
                        this.velocity.y = 0;
                    }
                } else {
                    // Horizontal collision
                    if (Math.abs(dx) > Math.abs(dz)) {
                        futurePosition.x = dx > 0 ? blockBox.max.x + 0.3 : blockBox.min.x - 0.3;
                        this.velocity.x = 0;
                    } else {
                        futurePosition.z = dz > 0 ? blockBox.max.z + 0.3 : blockBox.min.z - 0.3;
                        this.velocity.z = 0;
                    }
                }
            }
        });

        // Apply slime bounce
        if (onSlime && this.velocity.y <= 0) {
            this.velocity.y = 0.08;
            onGround = false;
            this.canJump = false;
        }

        this.isOnGround = onGround;

        // Check for falling
        if (futurePosition.y < -10) {
            this.handleFall();
            return;
        }

        // Apply final position
        this.player.position.copy(futurePosition);
    },

    checkCheckpoint(position) {
        if (this.checkpoints[this.currentCheckpoint] && 
            position.distanceTo(this.checkpoints[this.currentCheckpoint].position) < 2) {
            if (this.currentCheckpoint < this.checkpoints.length - 1) {
                this.currentCheckpoint++;
                this.showMessage(`CHECKPOINT ${this.currentCheckpoint}/${this.currentCourse.totalCheckpoints} REACHED`, 'checkpoint');
            } else if (!this.gameCompleted) {
                this.completeGame();
            }
        }
    },

    handleFall() {
        if (this.checkpoints[Math.max(0, this.currentCheckpoint - 1)]) {
            const checkpoint = this.checkpoints[Math.max(0, this.currentCheckpoint - 1)];
            this.player.position.copy(checkpoint.position);
            this.player.position.y += 1;
            this.velocity.set(0, 0, 0);
            this.fallCount++;
            
            // Set rotation when respawning at checkpoint
            this.mouseX = this.degreesToRadians(-checkpoint.rotation[0]); // Negative for correct direction
            this.mouseY = this.degreesToRadians(-checkpoint.rotation[1]); // Negative for correct direction
            
            this.showMessage('RESPAWNED AT CHECKPOINT', 'fall');
        } else {
            const spawn = this.currentCourse.spawnPoint;
            this.player.position.set(spawn[0], spawn[1], spawn[2]);
            this.velocity.set(0, 0, 0);
            this.fallCount++;
            
            // Set spawn rotation
            this.mouseX = this.degreesToRadians(-this.spawnRotation[0]);
            this.mouseY = this.degreesToRadians(-this.spawnRotation[1]);
            
            this.showMessage('RETURNED TO START', 'fall');
        }
    },

    updateCamera() {
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.y = this.mouseX;
        this.camera.rotation.x = this.mouseY;
        this.camera.position.copy(this.player.position);
        this.camera.position.y += 0.7;
    },

    updateUI() {
        if (this.inMenu) return;
        
        const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        document.getElementById('checkpointCount').textContent = this.currentCheckpoint;
        document.getElementById('fallCount').textContent = this.fallCount;

        const horizontalVelocity = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);
        document.getElementById('speedDisplay').textContent = (horizontalVelocity * 100).toFixed(1);
        
        document.getElementById('jumpStatus').textContent = this.isOnGround ? 'GROUND' : 'AIRBORNE';
        document.getElementById('heightDisplay').textContent = this.player.position.y.toFixed(1);
    },

    showMessage(text, type) {
        const messageElement = document.getElementById('gameMessage');
        messageElement.textContent = text;
        messageElement.className = `game-message ${type} show`;
        
        setTimeout(() => {
            messageElement.classList.remove('show');
        }, 2500);
    },

    completeGame() {
        if (this.gameCompleted) return;
        
        this.gameCompleted = true;
        const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        
        // Mark level as completed and unlock next level
        const levelOrder = ['training', 'intermediate', 'expert', 'insane'];
        const currentIndex = levelOrder.findIndex(level => this.currentCourse.name.toLowerCase().includes(level));
        const currentLevelKey = levelOrder[currentIndex];
        
        if (!this.completedLevels.includes(currentLevelKey)) {
            this.completedLevels.push(currentLevelKey);
            
            // Unlock next level
            if (currentIndex < levelOrder.length - 1) {
                const nextLevel = levelOrder[currentIndex + 1];
                if (!this.unlockedLevels.includes(nextLevel)) {
                    this.unlockedLevels.push(nextLevel);
                    this.showMessage(`${nextLevel.toUpperCase()} LEVEL UNLOCKED!`, 'checkpoint');
                }
            }
            
            this.saveProgress();
        }
        
        document.getElementById('finalStats').innerHTML = `
            COURSE: ${this.currentCourse.name}<br>
            DIFFICULTY: ${this.currentCourse.difficulty}<br>
            TIME: ${minutes}:${seconds.toString().padStart(2, '0')}<br>
            FALLS: ${this.fallCount}<br>
            ${this.fallCount === 0 ? 'PERFECT RUN!' : 'WELL DONE!'}
        `;
        
        document.getElementById('completionMessage').style.display = 'block';
        document.body.classList.remove('game-active'); // Show cursor
        
        // Also release pointer lock to ensure cursor is visible
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
    },

    resetGame() {
        this.gameCompleted = false;
        this.currentCheckpoint = 0;
        this.fallCount = 0;
        this.startTime = Date.now();
        
        const spawn = this.currentCourse ? this.currentCourse.spawnPoint : [1, 1.9, 1];
        this.player.position.set(spawn[0], spawn[1], spawn[2]);
        this.velocity.set(0, 0, 0);
        
        // Set spawn rotation using degrees
        this.mouseX = this.degreesToRadians(-this.spawnRotation[0]); // Negative for correct direction
        this.mouseY = this.degreesToRadians(-this.spawnRotation[1]); // Negative for correct direction
        
        document.getElementById('completionMessage').style.display = 'none';
    },

    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
            
            if (event.code === 'Space') event.preventDefault();
            if (event.code === 'Escape' && !this.inMenu) {
                this.returnToMenu();
            }
        });

        document.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });

        // Mouse events
        document.addEventListener('click', () => {
            if (!this.inMenu && document.pointerLockElement !== document.body) {
                document.body.requestPointerLock();
            }
        });

        document.addEventListener('mousemove', (event) => {
            if (document.pointerLockElement === document.body && !this.inMenu) {
                this.mouseX -= event.movementX * 0.002;
                this.mouseY -= event.movementY * 0.002;
                this.mouseY = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.mouseY));
            }
        });

        // Handle pointer lock changes
        document.addEventListener('pointerlockchange', () => {
            if (!document.pointerLockElement && !this.inMenu) {
                // Cursor was unlocked during gameplay, show menu
                this.returnToMenu();
            }
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    },

    animate() {
        requestAnimationFrame(() => this.animate());
        this.updatePlayer();
        
        // Animate skybox
        Skybox.animate();
        
        this.renderer.render(this.scene, this.camera);
    }
};