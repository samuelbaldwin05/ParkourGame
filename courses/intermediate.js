const IntermediateCourse = {
    name: "Intermediate Challenge",
    difficulty: "INTERMEDIATE",
    totalCheckpoints: 6,
    
    layout: [
        // Starting platform
        { type: 'platform', pos: [0, 0, 0], size: [3, 3], material: 'start' },
        
        // 4-block jump challenge
        { type: 'platform', pos: [7, 0, 0], size: [2, 2], material: 'normal' },
        { type: 'platform', pos: [12, 1, 0], size: [2, 2], material: 'normal' },
        
        // Checkpoint 1
        { type: 'platform', pos: [16, 1, 0], size: [3, 3], material: 'checkpoint' },
        
        // Zigzag section
        { type: 'platform', pos: [20, 2, 3], size: [2, 2], material: 'normal' },
        { type: 'platform', pos: [23, 3, -1], size: [2, 2], material: 'normal' },
        { type: 'platform', pos: [26, 4, 2], size: [2, 2], material: 'normal' },
        
        // Checkpoint 2
        { type: 'platform', pos: [30, 4, 2], size: [2, 2], material: 'checkpoint' },
        
        // Single block precision
        { type: 'block', pos: [33, 4, 2], material: 'normal' },
        { type: 'block', pos: [36, 5, 4], material: 'normal' },
        { type: 'block', pos: [39, 6, 1], material: 'normal' },
        
        // Slime chain
        { type: 'platform', pos: [42, 3, 0], size: [2, 2], material: 'slime' },
        { type: 'platform', pos: [45, 6, 3], size: [2, 2], material: 'normal' },
        { type: 'platform', pos: [48, 4, 6], size: [2, 2], material: 'slime' },
        { type: 'platform', pos: [51, 6, 9], size: [2, 2], material: 'normal' },
        
        // Checkpoint 3
        { type: 'platform', pos: [55, 6, 9], size: [3, 2], material: 'checkpoint' },
        
        // Descending jumps
        { type: 'platform', pos: [59, 6, 11], size: [2, 2], material: 'normal' },
        { type: 'platform', pos: [62, 5, 13], size: [2, 2], material: 'normal' },
        { type: 'platform', pos: [65, 3, 15], size: [2, 2], material: 'normal' },
        
        // Final challenge - long jump
        { type: 'platform', pos: [70, 3, 15], size: [2, 2], material: 'normal' },
        
        // Victory platform
        { type: 'platform', pos: [75, 3, 15], size: [4, 4], material: 'end' }
    ],
    
    checkpoints: [
        { pos: [1, 1, 1] },      // Start
        { pos: [17, 2, 1] },     // Checkpoint 1
        { pos: [31, 5, 3] },     // Checkpoint 2
        { pos: [56, 9, 10] },    // Checkpoint 3
        { pos: [77, 4, 17] }     // End
    ],
    
    spawnPoint: [1, 1.9, 1],
    spawnRotation: [90, 15]
};