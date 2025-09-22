const TrainingCourse = {
    name: "Training Course",
    difficulty: "BEGINNER",
    totalCheckpoints: 4,
    
    layout: [
        // Starting platform (3x3)
        { type: 'platform', pos: [0, 0, 0], size: [3, 3], material: 'start' },
        
        // Basic 2-block jumps
        { type: 'platform', pos: [4, 0, 0], size: [2, 2], material: 'normal' },
        { type: 'platform', pos: [7, 0, 0], size: [2, 2], material: 'normal' },
        { type: 'platform', pos: [10, 0, 0], size: [2, 2], material: 'normal' },
        
        // Checkpoint 1
        { type: 'platform', pos: [14, 0, 0], size: [3, 3], material: 'checkpoint' },
        
        // 3-block jump practice
        { type: 'platform', pos: [18, 0, 0], size: [2, 2], material: 'normal' },
        { type: 'platform', pos: [22, 0, 0], size: [2, 2], material: 'normal' },
        
        // Height variation (+1 block)
        { type: 'platform', pos: [25, 1, 0], size: [2, 2], material: 'normal' },
        
        // Checkpoint 2
        { type: 'platform', pos: [28, 1, 0], size: [3, 3], material: 'checkpoint' },
        
        // Introduction to slime
        { type: 'platform', pos: [32, 1, 0], size: [2, 2], material: 'slime' },
        { type: 'platform', pos: [35, 3, 0], size: [2, 2], material: 'normal' },
        
        // Final stretch
        { type: 'platform', pos: [38, 3, 0], size: [2, 2], material: 'normal' },
        { type: 'platform', pos: [41, 3, 0], size: [2, 2], material: 'normal' },
        
        // Victory platform
        { type: 'platform', pos: [45, 3, 0], size: [4, 4], material: 'end' }
    ],
    
    checkpoints: [
        { pos: [1, 1, 1] },      // Start
        { pos: [15, 1, 1] },     // Checkpoint 1
        { pos: [29, 2, 1] },     // Checkpoint 2
        { pos: [47, 4, 2] }      // End
    ],
    
    spawnPoint: [1, 1.9, 1],
    spawnRotation: [90, 15]
};