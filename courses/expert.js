const ExpertCourse = {
    name: "Expert Precision",
    difficulty: "EXPERT",
    totalCheckpoints: 7,
    
    layout: [
        // Starting platform
        { type: 'platform', pos: [0, 0, 0], size: [2, 2], material: 'start' },
        
        // Immediate 4-block challenge
        { type: 'block', pos: [5, 0, 0], material: 'normal' },
        { type: 'block', pos: [9, 1, 1], material: 'normal' },
        { type: 'block', pos: [13, 2, -1], material: 'normal' },
        
        // Checkpoint 1
        { type: 'platform', pos: [17, 2, -1], size: [2, 2], material: 'checkpoint' },
        
        // Neo jumps (4-block with height)
        { type: 'block', pos: [21, 2, 1], material: 'normal' },
        { type: 'block', pos: [25, 4, 2], material: 'normal' },
        { type: 'block', pos: [29, 6, 0], material: 'normal' },
        
        // Slime precision
        { type: 'block', pos: [33, 3, 2], material: 'slime' },
        { type: 'block', pos: [36, 8, 5], material: 'normal' },
        
        // Checkpoint 2
        { type: 'platform', pos: [40, 8, 5], size: [2, 2], material: 'checkpoint' },
        
        // Spiral tower climb
        { type: 'block', pos: [43, 9, 7], material: 'normal' },
        { type: 'block', pos: [45, 10, 4], material: 'normal' },
        { type: 'block', pos: [47, 11, 1], material: 'normal' },
        { type: 'block', pos: [49, 12, 4], material: 'normal' },
        { type: 'block', pos: [51, 13, 7], material: 'normal' },
        
        // Checkpoint 3
        { type: 'platform', pos: [55, 13, 7], size: [2, 2], material: 'checkpoint' },
        
        // Momentum section
        { type: 'block', pos: [58, 13, 9], material: 'slime' },
        { type: 'block', pos: [61, 17, 12], material: 'normal' },
        { type: 'block', pos: [64, 15, 15], material: 'normal' },
        { type: 'block', pos: [67, 13, 18], material: 'normal' },
        
        // Checkpoint 4
        { type: 'platform', pos: [71, 13, 18], size: [2, 2], material: 'checkpoint' },
        
        // Final gauntlet
        { type: 'block', pos: [75, 13, 20], material: 'normal' },
        { type: 'block', pos: [79, 14, 17], material: 'normal' },
        { type: 'block', pos: [83, 15, 20], material: 'normal' },
        { type: 'block', pos: [87, 16, 23], material: 'slime' },
        { type: 'platform', pos: [90, 20, 26], size: [2, 2], material: 'normal' },
        
        // Victory platform
        { type: 'platform', pos: [94, 20, 26], size: [3, 3], material: 'end' }
    ],
    
    checkpoints: [
        { pos: [1, 1, 1] },       // Start
        { pos: [18, 3, 0] },      // Checkpoint 1
        { pos: [41, 9, 6] },      // Checkpoint 2
        { pos: [56, 14, 8] },     // Checkpoint 3
        { pos: [72, 14, 19] },    // Checkpoint 4
        { pos: [95, 21, 27] }     // End
    ],
    
    spawnPoint: [1, 1.9, 1],
    spawnRotation: [90, 15]
};