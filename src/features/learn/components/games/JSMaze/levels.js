// JavaScript Puzzle Maze - 15 Progressive Levels
// Teaches: Variables, Loops, Conditionals, Functions, Algorithms

export const levels = [
  // ========== BEGINNER LEVELS (1-3): Basic Movement ==========
  {
    id: 1,
    title: "First Steps",
    description: "Learn basic movement commands to reach the goal.",
    instructions: "Use moveRight() and moveDown() to navigate to the exit. Each function moves the character one step.",
    difficulty: "easy",
    maze: [
      ['S', '.', '.', 'E'],
      ['.', '.', '.', '.']
    ],
    startPos: { row: 0, col: 0 },
    endPos: { row: 0, col: 3 },
    obstacles: [],
    requiredConcepts: ['Function calls', 'Sequential execution'],
    correctSolution: `moveRight();\nmoveRight();\nmoveRight();`,
    hints: [
      "You need to move 3 steps to the right",
      "Call moveRight() three times in sequence",
      "Each moveRight() moves you one cell to the right"
    ],
    jsReference: {
      title: "JavaScript Basics - Functions",
      sections: [
        {
          subtitle: "Movement Functions:",
          items: [
            { code: "moveRight()", description: "Move one cell right" },
            { code: "moveDown()", description: "Move one cell down" }
          ]
        }
      ],
      example: "moveRight();\nmoveRight();\nmoveRight();"
    },
    parTime: 30,
    baseXP: 50
  },
  {
    id: 2,
    title: "Corner Turn",
    description: "Navigate around a corner using multiple movement commands.",
    instructions: "Combine moveRight() and moveDown() to reach the goal in the bottom-right corner.",
    difficulty: "easy",
    maze: [
      ['S', '.', '.'],
      ['.', '.', '.'],
      ['.', '.', 'E']
    ],
    startPos: { row: 0, col: 0 },
    endPos: { row: 2, col: 2 },
    obstacles: [],
    requiredConcepts: ['Multiple function calls', 'Direction changes'],
    correctSolution: `moveRight();\nmoveRight();\nmoveDown();\nmoveDown();`,
    hints: [
      "Move right first, then move down",
      "You need 2 right moves and 2 down moves",
      "The order matters: right → right → down → down"
    ],
    jsReference: {
      title: "Sequential Execution",
      sections: [
        {
          subtitle: "All Movement Functions:",
          items: [
            { code: "moveUp()", description: "Move one cell up" },
            { code: "moveDown()", description: "Move one cell down" },
            { code: "moveLeft()", description: "Move one cell left" },
            { code: "moveRight()", description: "Move one cell right" }
          ]
        }
      ],
      example: "moveRight();\nmoveRight();\nmoveDown();\nmoveDown();"
    },
    parTime: 35,
    baseXP: 60
  },
  {
    id: 3,
    title: "Simple Loop",
    description: "Use your first loop to avoid repetitive code.",
    instructions: "Use a for loop to move right 4 times. Learn the power of iteration!",
    difficulty: "easy",
    maze: [
      ['S', '.', '.', '.', 'E'],
      ['.', '.', '.', '.', '.']
    ],
    startPos: { row: 0, col: 0 },
    endPos: { row: 0, col: 4 },
    obstacles: [],
    requiredConcepts: ['for loops', 'Loop iteration'],
    correctSolution: `for (let i = 0; i < 4; i++) {\n  moveRight();\n}`,
    hints: [
      "Use a for loop: for (let i = 0; i < count; i++) { }",
      "You need to move right 4 times",
      "Put moveRight() inside the loop body"
    ],
    jsReference: {
      title: "For Loops - Iteration",
      sections: [
        {
          subtitle: "For Loop Syntax:",
          items: [
            { code: "for (let i = 0; i < n; i++)", description: "Loop n times" },
            { code: "let i = 0", description: "Initialize counter" },
            { code: "i < n", description: "Condition to continue" },
            { code: "i++", description: "Increment after each loop" }
          ]
        }
      ],
      example: "for (let i = 0; i < 4; i++) {\n  moveRight();\n}"
    },
    parTime: 40,
    baseXP: 80
  },

  // ========== INTERMEDIATE LEVELS (4-8): Loops & Conditionals ==========
  {
    id: 4,
    title: "Obstacle Course",
    description: "Navigate around your first obstacle.",
    instructions: "Plan your path around the wall (█) to reach the exit.",
    difficulty: "medium",
    maze: [
      ['S', '.', '█', 'E'],
      ['.', '.', '█', '.'],
      ['.', '.', '.', '.']
    ],
    startPos: { row: 0, col: 0 },
    endPos: { row: 0, col: 3 },
    obstacles: [{ row: 0, col: 2 }, { row: 1, col: 2 }],
    requiredConcepts: ['Path planning', 'Loops', 'Mixed directions'],
    correctSolution: `moveRight();\nmoveDown();\nmoveDown();\nmoveRight();\nmoveRight();\nmoveUp();\nmoveUp();`,
    hints: [
      "You can't go through obstacles (█)",
      "Try going down first, then around",
      "Path: right → down(2) → right(2) → up(2)"
    ],
    jsReference: {
      title: "Path Planning & Obstacles",
      sections: [
        {
          subtitle: "Navigation Strategy:",
          items: [
            { code: "Plan before coding", description: "Visualize the path" },
            { code: "Avoid obstacles", description: "Cannot move through walls" },
            { code: "Combine moves", description: "Mix all four directions" }
          ]
        }
      ],
      example: "moveRight();\nmoveDown();\nmoveDown();\nmoveRight();\nmoveRight();\nmoveUp();\nmoveUp();"
    },
    parTime: 50,
    baseXP: 100
  },
  {
    id: 5,
    title: "Nested Loops",
    description: "Master nested loops to navigate a grid efficiently.",
    instructions: "Use nested loops to move in a zigzag pattern and reach the bottom-right.",
    difficulty: "medium",
    maze: [
      ['S', '.', '.', '.'],
      ['.', '.', '.', '.'],
      ['.', '.', '.', 'E']
    ],
    startPos: { row: 0, col: 0 },
    endPos: { row: 2, col: 3 },
    obstacles: [],
    requiredConcepts: ['Nested loops', 'Pattern recognition'],
    correctSolution: `for (let i = 0; i < 2; i++) {\n  for (let j = 0; j < 3; j++) {\n    moveRight();\n  }\n  moveDown();\n}\nmoveRight();`,
    hints: [
      "Move right 3 times, down once, repeat",
      "Outer loop for rows, inner loop for columns",
      "After the loop, move right one more time"
    ],
    jsReference: {
      title: "Nested Loops",
      sections: [
        {
          subtitle: "Loop Inside Loop:",
          items: [
            { code: "for (i...) { for (j...) {} }", description: "Outer loop contains inner loop" },
            { code: "Outer loop", description: "Runs fewer times (rows)" },
            { code: "Inner loop", description: "Runs many times (columns)" },
            { code: "Total iterations", description: "outer × inner" }
          ]
        }
      ],
      example: "for (let i = 0; i < 2; i++) {\n  for (let j = 0; j < 3; j++) {\n    moveRight();\n  }\n  moveDown();\n}"
    },
    parTime: 60,
    baseXP: 120
  },
  {
    id: 6,
    title: "Conditional Movement",
    description: "Use conditionals to make smart decisions.",
    instructions: "Check the current position and move accordingly. Use canMoveRight() to check if movement is possible.",
    difficulty: "medium",
    maze: [
      ['S', '.', '█', '.', 'E'],
      ['.', '.', '.', '.', '.']
    ],
    startPos: { row: 0, col: 0 },
    endPos: { row: 0, col: 4 },
    obstacles: [{ row: 0, col: 2 }],
    requiredConcepts: ['if statements', 'Helper functions', 'Conditionals'],
    correctSolution: `moveRight();\nif (!canMoveRight()) {\n  moveDown();\n  moveRight();\n  moveRight();\n  moveUp();\n} else {\n  moveRight();\n}\nmoveRight();`,
    hints: [
      "Use canMoveRight() to check for obstacles",
      "If blocked, go around (down → right → up)",
      "Always check before moving into obstacles"
    ],
    jsReference: {
      title: "Conditionals - If/Else",
      sections: [
        {
          subtitle: "If Statement Syntax:",
          items: [
            { code: "if (condition) { }", description: "Execute if true" },
            { code: "else { }", description: "Execute if false" },
            { code: "canMoveRight()", description: "Returns true/false" },
            { code: "!", description: "NOT operator (negation)" }
          ]
        }
      ],
      example: "if (!canMoveRight()) {\n  moveDown();\n  moveRight();\n  moveRight();\n  moveUp();\n}"
    },
    parTime: 70,
    baseXP: 140
  },
  {
    id: 7,
    title: "While Loop Navigation",
    description: "Use while loops for dynamic navigation.",
    instructions: "Keep moving right while you can, then adjust your path.",
    difficulty: "medium",
    maze: [
      ['S', '.', '.', '█'],
      ['.', '.', '.', '.'],
      ['.', '.', '.', 'E']
    ],
    startPos: { row: 0, col: 0 },
    endPos: { row: 2, col: 3 },
    obstacles: [{ row: 0, col: 3 }],
    requiredConcepts: ['while loops', 'Dynamic conditions'],
    correctSolution: `while (canMoveRight()) {\n  moveRight();\n}\nmoveDown();\nmoveDown();\nmoveRight();`,
    hints: [
      "Use while (canMoveRight()) { moveRight(); }",
      "After hitting the wall, move down twice",
      "Then move right to the goal"
    ],
    jsReference: {
      title: "While Loops",
      sections: [
        {
          subtitle: "While Loop Syntax:",
          items: [
            { code: "while (condition) { }", description: "Repeat while true" },
            { code: "Dynamic condition", description: "Checked each iteration" },
            { code: "canMoveRight()", description: "Boolean condition" },
            { code: "Unknown iterations", description: "Unlike for loops" }
          ]
        }
      ],
      example: "while (canMoveRight()) {\n  moveRight();\n}\nmoveDown();\nmoveDown();\nmoveRight();"
    },
    parTime: 75,
    baseXP: 150
  },
  {
    id: 8,
    title: "Function Basics",
    description: "Create reusable functions for complex patterns.",
    instructions: "Define a function moveRightTwice() and use it to navigate efficiently.",
    difficulty: "medium",
    maze: [
      ['S', '.', '.', '.', '.', 'E'],
      ['.', '.', '.', '.', '.', '.']
    ],
    startPos: { row: 0, col: 0 },
    endPos: { row: 0, col: 5 },
    obstacles: [],
    requiredConcepts: ['Function definition', 'Function reuse', 'DRY principle'],
    correctSolution: `function moveRightTwice() {\n  moveRight();\n  moveRight();\n}\n\nmoveRightTwice();\nmoveRightTwice();\nmoveRight();`,
    hints: [
      "Define: function moveRightTwice() { ... }",
      "Call it multiple times instead of repeating code",
      "Total moves needed: 5 right"
    ],
    jsReference: {
      title: "Functions - Reusable Code",
      sections: [
        {
          subtitle: "Function Definition:",
          items: [
            { code: "function name() { }", description: "Define a function" },
            { code: "name()", description: "Call/execute the function" },
            { code: "DRY Principle", description: "Don't Repeat Yourself" },
            { code: "Reusability", description: "Use same code multiple times" }
          ]
        }
      ],
      example: "function moveRightTwice() {\n  moveRight();\n  moveRight();\n}\n\nmoveRightTwice();\nmoveRightTwice();"
    },
    parTime: 80,
    baseXP: 160
  },

  // ========== ADVANCED LEVELS (9-12): Functions & Algorithms ==========
  {
    id: 9,
    title: "Function with Parameters",
    description: "Create functions that accept parameters for flexibility.",
    instructions: "Write a move(direction, steps) function that moves in any direction for a given number of steps.",
    difficulty: "hard",
    maze: [
      ['S', '.', '.', '.'],
      ['.', '█', '█', '.'],
      ['.', '.', '.', 'E']
    ],
    startPos: { row: 0, col: 0 },
    endPos: { row: 2, col: 3 },
    obstacles: [{ row: 1, col: 1 }, { row: 1, col: 2 }],
    requiredConcepts: ['Function parameters', 'Switch/if-else', 'Abstraction'],
    correctSolution: `function move(direction, steps) {\n  for (let i = 0; i < steps; i++) {\n    if (direction === 'right') moveRight();\n    else if (direction === 'down') moveDown();\n    else if (direction === 'left') moveLeft();\n    else if (direction === 'up') moveUp();\n  }\n}\n\nmove('right', 3);\nmove('down', 2);\nmove('right', 1);`,
    hints: [
      "Function signature: function move(direction, steps) { }",
      "Use a loop and if-else to handle directions",
      "Call: move('right', 3) to move right 3 times"
    ],
    jsReference: {
      title: "Function Parameters",
      sections: [
        {
          subtitle: "Parameters & Arguments:",
          items: [
            { code: "function name(param1, param2)", description: "Define with parameters" },
            { code: "name(value1, value2)", description: "Call with arguments" },
            { code: "if (param === 'value')", description: "Use parameters in logic" },
            { code: "Flexibility", description: "Same function, different inputs" }
          ]
        }
      ],
      example: "function move(dir, steps) {\n  for (let i = 0; i < steps; i++) {\n    if (dir === 'right') moveRight();\n  }\n}\nmove('right', 3);"
    },
    parTime: 90,
    baseXP: 180
  },
  {
    id: 10,
    title: "Complex Maze",
    description: "Navigate through a challenging multi-obstacle maze.",
    instructions: "Combine loops, conditionals, and functions to find your way through.",
    difficulty: "hard",
    maze: [
      ['S', '.', '█', '.', '.'],
      ['.', '.', '█', '.', '█'],
      ['.', '█', '.', '.', '.'],
      ['.', '.', '.', '█', 'E']
    ],
    startPos: { row: 0, col: 0 },
    endPos: { row: 3, col: 4 },
    obstacles: [
      { row: 0, col: 2 },
      { row: 1, col: 2 },
      { row: 1, col: 4 },
      { row: 2, col: 1 },
      { row: 3, col: 3 }
    ],
    requiredConcepts: ['Problem solving', 'Path planning', 'All previous concepts'],
    correctSolution: `moveRight();\nmoveDown();\nmoveDown();\nmoveRight();\nmoveDown();\nmoveRight();\nmoveRight();\nmoveUp();\nmoveRight();\nmoveDown();\nmoveDown();`,
    hints: [
      "Plan your path before coding",
      "There's a clear path through the obstacles",
      "Path: right → down(2) → right → down → right(2) → up → right → down(2)"
    ],
    jsReference: {
      title: "Complex Problem Solving",
      sections: [
        {
          subtitle: "Strategy:",
          items: [
            { code: "Visualize the maze", description: "Map out possible paths" },
            { code: "Break into steps", description: "Divide the problem" },
            { code: "Test incrementally", description: "Run often to debug" },
            { code: "Combine concepts", description: "Use loops + functions" }
          ]
        }
      ],
      example: "// Plan path first\nmoveRight();\nmoveDown();\nmoveDown();\nmoveRight();\nmoveDown();\nmoveRight();\nmoveRight();"
    },
    parTime: 100,
    baseXP: 200
  },
  {
    id: 11,
    title: "Smart Navigation",
    description: "Use helper functions to make intelligent decisions.",
    instructions: "Create a smartMove() function that checks all directions and picks the best one using canMove(direction).",
    difficulty: "hard",
    maze: [
      ['S', '.', '.', '█', 'E'],
      ['.', '█', '.', '.', '.'],
      ['.', '.', '.', '█', '.']
    ],
    startPos: { row: 0, col: 0 },
    endPos: { row: 0, col: 4 },
    obstacles: [{ row: 0, col: 3 }, { row: 1, col: 1 }, { row: 2, col: 3 }],
    requiredConcepts: ['Helper functions', 'Logic', 'Decision trees'],
    correctSolution: `function smartMove() {\n  if (canMoveRight()) {\n    moveRight();\n  } else if (canMoveDown()) {\n    moveDown();\n  } else if (canMoveUp()) {\n    moveUp();\n  }\n}\n\nfor (let i = 0; i < 10; i++) {\n  smartMove();\n}`,
    hints: [
      "Check canMoveRight() first (prefer right)",
      "If can't go right, try down, then up",
      "Loop multiple times to reach the goal"
    ],
    jsReference: {
      title: "Helper Functions & Logic",
      sections: [
        {
          subtitle: "Smart Decision Making:",
          items: [
            { code: "canMove(direction)", description: "Check if move is valid" },
            { code: "if-else chains", description: "Priority-based decisions" },
            { code: "Helper functions", description: "Encapsulate logic" },
            { code: "Iteration + decisions", description: "Loops with conditionals" }
          ]
        }
      ],
      example: "function smartMove() {\n  if (canMoveRight()) moveRight();\n  else if (canMoveDown()) moveDown();\n}\nfor (let i = 0; i < 10; i++) smartMove();"
    },
    parTime: 110,
    baseXP: 220
  },
  {
    id: 12,
    title: "Return Values",
    description: "Functions that return values for better code organization.",
    instructions: "Create a function getNextMove() that returns the best direction, then use it to navigate.",
    difficulty: "hard",
    maze: [
      ['S', '.', '.', '.', 'E'],
      ['.', '█', '█', '.', '.'],
      ['.', '.', '.', '.', '.']
    ],
    startPos: { row: 0, col: 0 },
    endPos: { row: 0, col: 4 },
    obstacles: [{ row: 1, col: 1 }, { row: 1, col: 2 }],
    requiredConcepts: ['Return values', 'Function composition', 'Clean code'],
    correctSolution: `function getNextMove() {\n  if (canMoveRight()) return 'right';\n  if (canMoveDown()) return 'down';\n  if (canMoveUp()) return 'up';\n  return 'none';\n}\n\nfunction moveInDirection(dir) {\n  if (dir === 'right') moveRight();\n  else if (dir === 'down') moveDown();\n  else if (dir === 'up') moveUp();\n}\n\nfor (let i = 0; i < 8; i++) {\n  moveInDirection(getNextMove());\n}`,
    hints: [
      "getNextMove() should return a string: 'right', 'down', 'up', or 'none'",
      "Use the return value to decide which move function to call",
      "Separate decision-making from execution"
    ],
    jsReference: {
      title: "Return Values",
      sections: [
        {
          subtitle: "Returning from Functions:",
          items: [
            { code: "return value", description: "Send value back to caller" },
            { code: "const result = func()", description: "Capture returned value" },
            { code: "Function composition", description: "Use output as input" },
            { code: "Separation of concerns", description: "One function, one job" }
          ]
        }
      ],
      example: "function getDirection() {\n  if (canMoveRight()) return 'right';\n  return 'down';\n}\nconst dir = getDirection();"
    },
    parTime: 120,
    baseXP: 240
  },

  // ========== EXPERT LEVELS (13-15): Algorithms ==========
  {
    id: 13,
    title: "Pathfinding Basics",
    description: "Implement a simple pathfinding algorithm.",
    instructions: "Use a systematic approach to explore the maze until you find the exit.",
    difficulty: "expert",
    maze: [
      ['S', '.', '█', '.', '.'],
      ['.', '.', '█', '.', '█'],
      ['█', '.', '.', '.', '.'],
      ['.', '.', '█', '.', '.'],
      ['.', '.', '.', '.', 'E']
    ],
    startPos: { row: 0, col: 0 },
    endPos: { row: 4, col: 4 },
    obstacles: [
      { row: 0, col: 2 },
      { row: 1, col: 2 },
      { row: 1, col: 4 },
      { row: 2, col: 0 },
      { row: 3, col: 2 }
    ],
    requiredConcepts: ['Pathfinding', 'Systematic exploration', 'Algorithm design'],
    correctSolution: `function explore() {\n  const directions = ['right', 'down', 'left', 'up'];\n  for (let dir of directions) {\n    if (canMove(dir) && !isVisited(dir)) {\n      move(dir, 1);\n      if (isAtGoal()) return true;\n      if (explore()) return true;\n      moveBack(dir);\n    }\n  }\n  return false;\n}\n\nexplore();`,
    hints: [
      "Try each direction systematically",
      "Keep track of visited positions",
      "Use recursion or backtracking if stuck"
    ],
    jsReference: {
      title: "Pathfinding Algorithms",
      sections: [
        {
          subtitle: "Algorithm Basics:",
          items: [
            { code: "Systematic exploration", description: "Try all possibilities" },
            { code: "Recursion", description: "Function calls itself" },
            { code: "Backtracking", description: "Undo wrong moves" },
            { code: "Base case", description: "When to stop recursion" }
          ]
        }
      ],
      example: "function explore() {\n  for (let dir of ['right','down','left','up']) {\n    if (canMove(dir)) {\n      move(dir);\n      if (explore()) return true;\n    }\n  }\n}"
    },
    parTime: 150,
    baseXP: 280
  },
  {
    id: 14,
    title: "Optimized Path",
    description: "Find the shortest path through the maze.",
    instructions: "Not just any path - find the SHORTEST path to maximize your efficiency score!",
    difficulty: "expert",
    maze: [
      ['S', '.', '.', '█', '.', 'E'],
      ['.', '█', '.', '█', '.', '.'],
      ['.', '.', '.', '.', '█', '.'],
      ['█', '█', '.', '.', '.', '.']
    ],
    startPos: { row: 0, col: 0 },
    endPos: { row: 0, col: 5 },
    obstacles: [
      { row: 0, col: 3 },
      { row: 1, col: 1 },
      { row: 1, col: 3 },
      { row: 2, col: 4 },
      { row: 3, col: 0 },
      { row: 3, col: 1 }
    ],
    requiredConcepts: ['BFS/DFS', 'Optimization', 'Shortest path'],
    correctSolution: `moveRight();\nmoveRight();\nmoveDown();\nmoveRight();\nmoveDown();\nmoveRight();\nmoveRight();\nmoveUp();\nmoveUp();`,
    hints: [
      "There are multiple paths - find the shortest",
      "Count your moves - fewer is better",
      "The optimal solution uses 9 moves"
    ],
    jsReference: {
      title: "Optimization - Shortest Path",
      sections: [
        {
          subtitle: "Finding Optimal Solutions:",
          items: [
            { code: "BFS (Breadth-First Search)", description: "Explore level by level" },
            { code: "DFS (Depth-First Search)", description: "Explore one path fully" },
            { code: "Path length", description: "Count total moves" },
            { code: "Optimization", description: "Minimize moves/time" }
          ]
        }
      ],
      example: "// Shortest path\nmoveRight();\nmoveRight();\nmoveDown();\nmoveRight();\n// ...9 total moves"
    },
    parTime: 180,
    baseXP: 300
  },
  {
    id: 15,
    title: "The Ultimate Challenge",
    description: "Master maze - combine everything you've learned!",
    instructions: "Navigate the largest, most complex maze using all your JavaScript knowledge.",
    difficulty: "expert",
    maze: [
      ['S', '.', '█', '.', '.', '.', '█'],
      ['.', '.', '█', '.', '█', '.', '.'],
      ['.', '█', '.', '.', '█', '█', '.'],
      ['.', '.', '.', '█', '.', '.', '.'],
      ['█', '█', '.', '█', '.', '█', '.'],
      ['.', '.', '.', '.', '.', '.', 'E']
    ],
    startPos: { row: 0, col: 0 },
    endPos: { row: 5, col: 6 },
    obstacles: [
      { row: 0, col: 2 }, { row: 0, col: 6 },
      { row: 1, col: 2 }, { row: 1, col: 4 },
      { row: 2, col: 1 }, { row: 2, col: 4 }, { row: 2, col: 5 },
      { row: 3, col: 3 },
      { row: 4, col: 0 }, { row: 4, col: 1 }, { row: 4, col: 3 }, { row: 4, col: 5 }
    ],
    requiredConcepts: ['All concepts', 'Algorithm mastery', 'Problem solving'],
    correctSolution: `function navigate() {\n  moveRight();\n  moveDown();\n  moveDown();\n  moveRight();\n  moveRight();\n  moveDown();\n  moveRight();\n  moveDown();\n  moveRight();\n  moveRight();\n  moveDown();\n  moveRight();\n}\n\nnavigate();`,
    hints: [
      "This is the final test - use everything you know",
      "Plan carefully before coding",
      "Optimal path exists - can you find it?"
    ],
    jsReference: {
      title: "Master Challenge - All Concepts",
      sections: [
        {
          subtitle: "Complete JavaScript Toolkit:",
          items: [
            { code: "Functions", description: "Reusable code blocks" },
            { code: "Loops (for/while)", description: "Iteration" },
            { code: "Conditionals (if/else)", description: "Decision making" },
            { code: "Algorithms", description: "Problem-solving strategies" }
          ]
        }
      ],
      example: "// Use all your skills!\nfunction navigate() {\n  // Plan, code, solve!\n  for (let i = 0; i < steps; i++) {\n    if (canMoveRight()) moveRight();\n  }\n}"
    },
    parTime: 240,
    baseXP: 350
  }
];

// Helper function to get level by ID
export const getLevelById = (id) => {
  return levels.find(level => level.id === id);
};

// Get levels by difficulty
export const getLevelsByDifficulty = (difficulty) => {
  return levels.filter(level => level.difficulty === difficulty);
};

// Calculate total XP for all levels
export const getTotalPossibleXP = () => {
  return levels.reduce((sum, level) => sum + level.baseXP, 0);
};
