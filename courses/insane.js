const InsaneCourse = {
    name: "Insane Nightmare",
    difficulty: "INSANE",
    totalCheckpoints: 8,
    
    layout: [
        // Starting platform - smaller
        { type: 'platform', pos: [0, 0, 0], size: [2, 2], material: 'start' },
        
        // Immediate max distance jumps
        { type: 'block', pos: [5, 0, 0], material: 'normal' },
        { type: 'block', pos: [10, 1, 2], material: 'normal' },
        { type: 'block', pos: [15, 2, -1], material: 'normal' },
        
        // First slime boost required
        { type: 'block', pos: [20, 0, 1], material: 'slime' },
        { type: 'block', pos: [24, 5, 4], material: 'normal' },
        
        // Checkpoint 1
        { type: 'platform', pos: [28, 5, 4], size: [2, 2], material: 'checkpoint' },
        
        // Triple neo section
        { type: 'block', pos: [32, 7, 6], material: 'normal' },
        { type: 'block', pos: [36, 9, 3], material: 'normal' },
        { type: 'block', pos: [40, 11, 6], material: 'normal' },
        
        // Precision slime chain
        { type: 'block', pos: [44, 8, 8], material: 'slime' },
        { type: 'block', pos: [47, 13, 11], material: 'normal' },
        { type: 'block', pos: [50, 10, 14], material: 'slime' },
        { type: 'block', pos: [53, 15, 17], material: 'normal' },
        
        // Checkpoint 2
        { type: 'block', pos: [57, 15, 17], material: 'checkpoint' },
        
        // Spiral nightmare
        { type: 'block', pos: [60, 16, 19], material: 'normal' },
        { type: 'block', pos: [62, 17, 16], material: 'normal' },
        { type: 'block', pos: [64, 18, 13], material: 'normal' },
        { type: 'block', pos: [66, 19, 16], material: 'normal' },
        { type: 'block', pos: [68, 20, 19], material: 'normal' },
        { type: 'block', pos: [70, 21, 22], material: 'normal' },
        
        // Checkpoint 3
        { type: 'block', pos: [74, 21, 22], material: 'checkpoint' },
        
        // Momentum master section
        { type: 'block', pos: [78, 21, 24], material: 'slime' },
        { type: 'block', pos: [82, 26, 27], material: 'normal' },
        { type: 'block', pos: [86, 24, 30], material: 'normal' },
        { type: 'block', pos: [90, 22, 33], material: 'slime' },
        { type: 'block', pos: [94, 27, 36], material: 'normal' },
        
        // Checkpoint 4
        { type: 'block', pos: [98, 27, 36], material: 'checkpoint' },
        
        // Death drop section
        { type: 'block', pos: [102, 25, 38], material: 'normal' },
        { type: 'block', pos: [106, 20, 40], material: 'normal' },
        { type: 'block', pos: [110, 15, 42], material: 'normal' },
        { type: 'block', pos: [114, 10, 44], material: 'slime' },
        { type: 'block', pos: [118, 18, 47], material: 'normal' },
        
        // Checkpoint 5
        { type: 'block', pos: [122, 18, 47], material: 'checkpoint' },
        
        // Final impossible section
        { type: 'block', pos: [127, 19, 49], material: 'normal' },
        { type: 'block', pos: [132, 20, 46], material: 'slime' },
        { type: 'block', pos: [136, 25, 43], material: 'normal' },
        { type: 'block', pos: [140, 23, 46], material: 'normal' },
        
        // Victory - tiny platform
        { type: 'platform', pos: [145, 23, 46], size: [2, 2], material: 'end' }
    ],
    
    checkpoints: [
        { pos: [1, 1, 1] },        // Start
        { pos: [29, 6, 5] },       // Checkpoint 1
        { pos: [58, 16, 18] },     // Checkpoint 2
        { pos: [75, 22, 23] },     // Checkpoint 3
        { pos: [99, 28, 37] },     // Checkpoint 4
        { pos: [123, 19, 48] },    // Checkpoint 5
        { pos: [146, 24, 47] }     // End
    ],
    
    spawnPoint: [1, 1.9, 1],
    spawnRotation: [90, 15]
};