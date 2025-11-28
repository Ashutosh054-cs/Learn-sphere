// JavaScript Maze Execution Engine
// Sandboxed code execution without eval() for security

class MazeExecutionEngine {
  constructor(maze, startPos, endPos, obstacles) {
    this.maze = maze;
    this.startPos = { ...startPos };
    this.endPos = { ...endPos };
    this.obstacles = obstacles;
    this.reset();
  }

  reset() {
    this.currentPos = { ...this.startPos };
    this.moveHistory = [];
    this.visitedPositions = new Set();
    this.visitedPositions.add(`${this.startPos.row},${this.startPos.col}`);
    this.moveCount = 0;
    this.errors = [];
    this.success = false;
  }

  // Available movement functions for user code
  moveRight() {
    return this._move(0, 1, 'right');
  }

  moveLeft() {
    return this._move(0, -1, 'left');
  }

  moveDown() {
    return this._move(1, 0, 'down');
  }

  moveUp() {
    return this._move(-1, 0, 'up');
  }

  // Helper functions available to user
  canMoveRight() {
    return this._canMove(0, 1);
  }

  canMoveLeft() {
    return this._canMove(0, -1);
  }

  canMoveDown() {
    return this._canMove(1, 0);
  }

  canMoveUp() {
    return this._canMove(-1, 0);
  }

  canMove(direction) {
    const moves = {
      'right': () => this.canMoveRight(),
      'left': () => this.canMoveLeft(),
      'down': () => this.canMoveDown(),
      'up': () => this.canMoveUp()
    };
    return moves[direction] ? moves[direction]() : false;
  }

  isAtGoal() {
    return this.currentPos.row === this.endPos.row && 
           this.currentPos.col === this.endPos.col;
  }

  isVisited(direction) {
    const deltas = {
      'right': [0, 1],
      'left': [0, -1],
      'down': [1, 0],
      'up': [-1, 0]
    };
    const [dRow, dCol] = deltas[direction] || [0, 0];
    const newRow = this.currentPos.row + dRow;
    const newCol = this.currentPos.col + dCol;
    return this.visitedPositions.has(`${newRow},${newCol}`);
  }

  getPosition() {
    return { ...this.currentPos };
  }

  getMoveCount() {
    return this.moveCount;
  }

  // Internal movement logic
  _move(dRow, dCol, direction) {
    const newRow = this.currentPos.row + dRow;
    const newCol = this.currentPos.col + dCol;

    // Check boundaries
    if (newRow < 0 || newRow >= this.maze.length || 
        newCol < 0 || newCol >= this.maze[0].length) {
      this.errors.push({
        type: 'boundary',
        message: `Cannot move ${direction} - out of bounds`,
        position: { ...this.currentPos }
      });
      return false;
    }

    // Check obstacles
    if (this._isObstacle(newRow, newCol)) {
      this.errors.push({
        type: 'obstacle',
        message: `Cannot move ${direction} - obstacle in the way`,
        position: { row: newRow, col: newCol }
      });
      return false;
    }

    // Valid move
    const oldPos = { ...this.currentPos };
    this.currentPos = { row: newRow, col: newCol };
    this.moveHistory.push({
      from: oldPos,
      to: { ...this.currentPos },
      direction,
      moveNumber: this.moveCount + 1
    });
    this.visitedPositions.add(`${newRow},${newCol}`);
    this.moveCount++;

    // Check win condition
    if (this.isAtGoal()) {
      this.success = true;
    }

    return true;
  }

  _canMove(dRow, dCol) {
    const newRow = this.currentPos.row + dRow;
    const newCol = this.currentPos.col + dCol;

    // Check boundaries
    if (newRow < 0 || newRow >= this.maze.length || 
        newCol < 0 || newCol >= this.maze[0].length) {
      return false;
    }

    // Check obstacles
    if (this._isObstacle(newRow, newCol)) {
      return false;
    }

    return true;
  }

  _isObstacle(row, col) {
    return this.obstacles.some(obs => obs.row === row && obs.col === col);
  }

  moveBack(direction) {
    const opposites = {
      'right': () => this.moveLeft(),
      'left': () => this.moveRight(),
      'down': () => this.moveUp(),
      'up': () => this.moveDown()
    };
    if (opposites[direction]) {
      opposites[direction]();
    }
  }

  // Execute user code in controlled environment
  async executeUserCode(userCode) {
    this.reset();

    try {
      // Create a sandboxed context with allowed functions
      const context = {
        moveRight: this.moveRight.bind(this),
        moveLeft: this.moveLeft.bind(this),
        moveDown: this.moveDown.bind(this),
        moveUp: this.moveUp.bind(this),
        canMoveRight: this.canMoveRight.bind(this),
        canMoveLeft: this.canMoveLeft.bind(this),
        canMoveDown: this.canMoveDown.bind(this),
        canMoveUp: this.canMoveUp.bind(this),
        canMove: this.canMove.bind(this),
        isAtGoal: this.isAtGoal.bind(this),
        isVisited: this.isVisited.bind(this),
        getPosition: this.getPosition.bind(this),
        moveBack: this.moveBack.bind(this),
        move: (direction, steps) => {
          for (let i = 0; i < steps; i++) {
            if (direction === 'right') this.moveRight();
            else if (direction === 'left') this.moveLeft();
            else if (direction === 'down') this.moveDown();
            else if (direction === 'up') this.moveUp();
          }
        }
      };

      // Safety limits
      const MAX_MOVES = 1000;
      const MAX_TIME = 5000; // 5 seconds

      const startTime = Date.now();
      
      // Wrap user code in async function to allow await
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const userFunction = new AsyncFunction(
        ...Object.keys(context),
        userCode
      );

      // Execute with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Execution timeout - code took too long')), MAX_TIME);
      });

      const executionPromise = userFunction(...Object.values(context));

      await Promise.race([executionPromise, timeoutPromise]);

      // Check move limit
      if (this.moveCount > MAX_MOVES) {
        throw new Error(`Too many moves (${this.moveCount}). Maximum allowed: ${MAX_MOVES}`);
      }

      // Check execution time
      const executionTime = Date.now() - startTime;

      return {
        success: this.success,
        moveCount: this.moveCount,
        moveHistory: this.moveHistory,
        errors: this.errors,
        currentPos: this.currentPos,
        isAtGoal: this.isAtGoal(),
        executionTime,
        visitedCount: this.visitedPositions.size
      };

    } catch (error) {
      // Handle syntax errors and runtime errors
      return {
        success: false,
        moveCount: this.moveCount,
        moveHistory: this.moveHistory,
        errors: [
          ...this.errors,
          {
            type: 'runtime',
            message: error.message,
            stack: error.stack
          }
        ],
        currentPos: this.currentPos,
        isAtGoal: false,
        executionTime: 0,
        visitedCount: this.visitedPositions.size
      };
    }
  }

  // Calculate efficiency score based on move count
  calculateEfficiency(optimalMoves) {
    if (this.moveCount === 0) return 0;
    const efficiency = (optimalMoves / this.moveCount) * 100;
    return Math.min(100, Math.max(0, Math.round(efficiency)));
  }

  // Get path visualization data
  getPathVisualization() {
    return {
      visited: Array.from(this.visitedPositions).map(pos => {
        const [row, col] = pos.split(',').map(Number);
        return { row, col };
      }),
      path: this.moveHistory.map(move => move.to),
      current: this.currentPos
    };
  }
}

// Validate user code for common patterns (optional pre-check)
export function validateCode(code) {
  const errors = [];
  const warnings = [];

  // Check for dangerous patterns
  const dangerousPatterns = [
    { pattern: /eval\s*\(/gi, message: 'eval() is not allowed' },
    { pattern: /Function\s*\(/gi, message: 'Function constructor is not allowed' },
    { pattern: /import\s+/gi, message: 'import statements are not allowed' },
    { pattern: /require\s*\(/gi, message: 'require() is not allowed' },
    { pattern: /window\./gi, message: 'window object access is not allowed' },
    { pattern: /document\./gi, message: 'document object access is not allowed' },
    { pattern: /fetch\s*\(/gi, message: 'Network requests are not allowed' },
    { pattern: /XMLHttpRequest/gi, message: 'XMLHttpRequest is not allowed' }
  ];

  dangerousPatterns.forEach(({ pattern, message }) => {
    if (pattern.test(code)) {
      errors.push(message);
    }
  });

  // Check for infinite loop patterns (basic detection)
  if (/while\s*\(\s*true\s*\)/gi.test(code) && !/break/gi.test(code)) {
    warnings.push('Potential infinite loop detected - make sure you have a break condition');
  }

  // Check for basic syntax
  if (!code.trim()) {
    errors.push('Code cannot be empty');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Calculate optimal move count for a level (used for par calculation)
export function calculateOptimalMoves(level) {
  // For levels with correctSolution, count the move commands
  if (level.correctSolution) {
    const moveCommands = ['moveRight', 'moveLeft', 'moveDown', 'moveUp'];
    const lines = level.correctSolution.split('\n');
    let count = 0;
    
    lines.forEach(line => {
      moveCommands.forEach(cmd => {
        if (line.includes(cmd)) count++;
      });
    });
    
    return count;
  }
  
  // Fallback: Manhattan distance
  const rowDiff = Math.abs(level.endPos.row - level.startPos.row);
  const colDiff = Math.abs(level.endPos.col - level.startPos.col);
  return rowDiff + colDiff;
}

// Static wrapper for easy execution
MazeExecutionEngine.execute = async function(code, level) {
  const engine = new MazeExecutionEngine(
    level.maze,
    level.startPos,
    level.endPos,
    level.obstacles || []
  );
  
  const result = await engine.executeUserCode(code);
  
  // Calculate optimal moves for efficiency
  const optimalMoves = calculateOptimalMoves(level);
  const efficiency = engine.calculateEfficiency(optimalMoves);
  
  return {
    success: result.success,
    reachedGoal: result.isAtGoal,
    path: result.moveHistory.map(m => m.to),
    error: result.errors.length > 0 ? result.errors[0].message : null,
    efficiency: efficiency,
    moveCount: result.moveCount
  };
};

export default MazeExecutionEngine;
