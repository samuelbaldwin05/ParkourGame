const Skybox = {
    starField: null,
    planets: [],
    nebula: null,

    create(scene) {
        this.createStarField(scene);
        this.createNebula(scene);
        this.createPlanets(scene);
        this.createDistantStructures(scene);
    },

    createStarField(scene) {
        // Create thousands of stars
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 3000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount * 3; i += 3) {
            // Random positions in a large sphere
            const radius = 400 + Math.random() * 100;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = radius * Math.cos(phi);
            positions[i + 2] = radius * Math.sin(phi) * Math.sin(theta);
            
            // Star colors (white, blue, yellow, red)
            const colorType = Math.random();
            if (colorType < 0.6) {
                // White stars
                colors[i] = 1.0;
                colors[i + 1] = 1.0;
                colors[i + 2] = 1.0;
            } else if (colorType < 0.8) {
                // Blue stars
                colors[i] = 0.7;
                colors[i + 1] = 0.9;
                colors[i + 2] = 1.0;
            } else if (colorType < 0.95) {
                // Yellow stars
                colors[i] = 1.0;
                colors[i + 1] = 1.0;
                colors[i + 2] = 0.7;
            } else {
                // Red stars
                colors[i] = 1.0;
                colors[i + 1] = 0.5;
                colors[i + 2] = 0.3;
            }
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.starField = new THREE.Points(starGeometry, starMaterial);
        scene.add(this.starField);
    },

    createNebula(scene) {
        // Create colorful nebula clouds in the background
        const nebulaGeometry = new THREE.SphereGeometry(300, 32, 32);
        const nebulaMaterial = new THREE.MeshBasicMaterial({
            color: 0x4a0e4e,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        
        this.nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
        scene.add(this.nebula);
        
        // Add multiple colored nebula layers
        const nebulaColors = [
            { color: 0x0066cc, opacity: 0.08 },
            { color: 0x6600cc, opacity: 0.06 },
            { color: 0x00ccaa, opacity: 0.04 }
        ];
        
        nebulaColors.forEach((nebula, index) => {
            const geometry = new THREE.SphereGeometry(280 + index * 10, 32, 32);
            const material = new THREE.MeshBasicMaterial({
                color: nebula.color,
                transparent: true,
                opacity: nebula.opacity,
                side: THREE.BackSide
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            scene.add(mesh);
        });
    },

    createPlanets(scene) {
        const planetConfigs = [
            {
                size: 15,
                distance: 200,
                color: 0xff6b47,
                position: [150, 80, -100],
                rings: false,
                name: 'Mars-like'
            },
            {
                size: 25,
                distance: 300,
                color: 0x4169e1,
                position: [-200, 50, 150],
                rings: true,
                name: 'Gas Giant'
            },
            {
                size: 8,
                distance: 180,
                color: 0xcccccc,
                position: [100, -60, 120],
                rings: false,
                name: 'Moon'
            },
            {
                size: 35,
                distance: 400,
                color: 0x9966cc,
                position: [0, 100, -300],
                rings: false,
                name: 'Distant Planet'
            }
        ];

        planetConfigs.forEach(config => {
            // Create planet
            const planetGeometry = new THREE.SphereGeometry(config.size, 32, 32);
            const planetMaterial = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.9
            });
            
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            planet.position.set(config.position[0], config.position[1], config.position[2]);
            
            // Add atmosphere glow
            const atmosphereGeometry = new THREE.SphereGeometry(config.size * 1.2, 32, 32);
            const atmosphereMaterial = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.2,
                side: THREE.BackSide
            });
            
            const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
            atmosphere.position.copy(planet.position);
            
            scene.add(planet);
            scene.add(atmosphere);
            
            // Add rings if specified
            if (config.rings) {
                const ringGeometry = new THREE.RingGeometry(config.size * 1.5, config.size * 2.2, 64);
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: 0xaaaaaa,
                    transparent: true,
                    opacity: 0.6,
                    side: THREE.DoubleSide
                });
                
                const rings = new THREE.Mesh(ringGeometry, ringMaterial);
                rings.position.copy(planet.position);
                rings.rotation.x = Math.PI / 2 + Math.random() * 0.3;
                rings.rotation.z = Math.random() * 0.3;
                
                scene.add(rings);
            }
            
            // Store for animation
            this.planets.push({
                mesh: planet,
                atmosphere: atmosphere,
                rotationSpeed: 0.001 + Math.random() * 0.002
            });
        });
    },

    createDistantStructures(scene) {
        // Create distant space station silhouettes
        const structures = [
            {
                type: 'station',
                position: [-300, 20, 200],
                scale: 2
            },
            {
                type: 'ring',
                position: [250, -50, 180],
                scale: 1.5
            }
        ];

        structures.forEach(structure => {
            if (structure.type === 'station') {
                // Simple space station structure
                const mainGeometry = new THREE.CylinderGeometry(2, 2, 20, 8);
                const ringGeometry = new THREE.TorusGeometry(8, 1, 8, 16);
                
                const material = new THREE.MeshBasicMaterial({
                    color: 0x333333,
                    transparent: true,
                    opacity: 0.7
                });
                
                const main = new THREE.Mesh(mainGeometry, material);
                const ring1 = new THREE.Mesh(ringGeometry, material);
                const ring2 = new THREE.Mesh(ringGeometry, material);
                
                ring1.position.y = 5;
                ring2.position.y = -5;
                
                const station = new THREE.Group();
                station.add(main);
                station.add(ring1);
                station.add(ring2);
                
                station.position.set(...structure.position);
                station.scale.setScalar(structure.scale);
                
                scene.add(station);
                
                // Add some lights to the station
                const lightGeometry = new THREE.SphereGeometry(0.5, 8, 8);
                const lightMaterial = new THREE.MeshBasicMaterial({
                    color: 0x00ffff,
                    transparent: true,
                    opacity: 0.8
                });
                
                for (let i = 0; i < 6; i++) {
                    const light = new THREE.Mesh(lightGeometry, lightMaterial);
                    light.position.set(
                        (Math.random() - 0.5) * 20,
                        (Math.random() - 0.5) * 20,
                        (Math.random() - 0.5) * 10
                    );
                    station.add(light);
                }
            } else if (structure.type === 'ring') {
                // Large ring structure
                const ringGeometry = new THREE.TorusGeometry(15, 2, 8, 32);
                const material = new THREE.MeshBasicMaterial({
                    color: 0x444444,
                    transparent: true,
                    opacity: 0.6
                });
                
                const ring = new THREE.Mesh(ringGeometry, material);
                ring.position.set(...structure.position);
                ring.scale.setScalar(structure.scale);
                ring.rotation.x = Math.random() * Math.PI;
                ring.rotation.y = Math.random() * Math.PI;
                
                scene.add(ring);
            }
        });
    },

    animate() {
        // Rotate star field slowly
        if (this.starField) {
            this.starField.rotation.y += 0.0001;
        }
        
        // Rotate nebula
        if (this.nebula) {
            this.nebula.rotation.x += 0.0002;
            this.nebula.rotation.y += 0.0001;
        }
        
        // Rotate planets
        this.planets.forEach(planet => {
            planet.mesh.rotation.y += planet.rotationSpeed;
            planet.atmosphere.rotation.y += planet.rotationSpeed * 0.8;
        });
    }
};