/* 
the Ai is X
Human player is O
*/
const lines = [
    // Horizontal
    [0, 1, 2, 3],
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    [3, 4, 5, 6],

    [7, 8, 9, 10],
    [8, 9, 10, 11],
    [9, 10, 11, 12],
    [10, 11, 12, 13],

    [14, 15, 16, 17],
    [15, 16, 17, 18],
    [16, 17, 18, 19],
    [17, 18, 19, 20],

    [21, 22, 23, 24],
    [22, 23, 24, 25],
    [23, 24, 25, 26],
    [24, 25, 26, 27],

    [28, 29, 30, 31],
    [29, 30, 31, 32],
    [30, 31, 32, 33],
    [31, 32, 33, 34],

    [35, 36, 37, 38],
    [36, 37, 38, 39],
    [37, 38, 39, 40],
    [38, 39, 40, 41],

    // Vertical
    [0, 7, 14, 21],
    [1, 8, 15, 22],
    [2, 9, 16, 23],
    [3, 10, 17, 24],
    [4, 11, 18, 25],
    [5, 12, 19, 26],
    [6, 13, 20, 27],

    [7, 14, 21, 28],
    [8, 15, 22, 29],
    [9, 16, 23, 30],
    [10, 17, 24, 31],
    [11, 18, 25, 32],
    [12, 19, 26, 33],
    [13, 20, 27, 34],

    [14, 21, 28, 35],
    [15, 22, 29, 36],
    [16, 23, 30, 37],
    [17, 24, 31, 38],
    [18, 25, 32, 39],
    [19, 26, 33, 40],
    [20, 27, 34, 41],

    // Diagonal ↘
    [0, 8, 16, 24],
    [1, 9, 17, 25],
    [2, 10, 18, 26],
    [3, 11, 19, 27],

    [7, 15, 23, 31],
    [8, 16, 24, 32],
    [9, 17, 25, 33],
    [10, 18, 26, 34],

    [14, 22, 30, 38],
    [15, 23, 31, 39],
    [16, 24, 32, 40],
    [17, 25, 33, 41],

    // Diagonal ↙
    [3, 9, 15, 21],
    [4, 10, 16, 22],
    [5, 11, 17, 23],
    [6, 12, 18, 24],

    [10, 16, 22, 28],
    [11, 17, 23, 29],
    [12, 18, 24, 30],
    [13, 19, 25, 31],

    [17, 23, 29, 35],
    [18, 24, 30, 36],
    [19, 25, 31, 37],
    [20, 26, 32, 38],
    ];

//if at any point there are three matching symbols on the board
//in any of the listed orders the game is won for that symbol
function calculateWinner(squares) {  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]) {// if a = b and a = c then b = c
        return squares[a];
    }
  }
  return null;
}

const scores = {
    X: 1000,
    O: -1000,
    tie: 0
}

let nodesExamined = 0;   // boards looked at during the current move

const min = (val1, val2) => {
    if (val1 < val2) {
        return val1;
    } else {
        return val2;
    }
}

const max = (val1, val2) => {
    if (val1 > val2) {
        return val1;
    } else {
        return val2;
    }
}

// heurstic evaluation function to assess the board state and return a score
const evaluateBoard = (gameState) => { //how close are we to any winning positions
    let score = 0;
    for (const line of lines){
        let xCount = 0;
        let oCount = 0;
        let emptyCount = 0;

        for (const index of line){
            if (gameState[index] === 'X'){
                xCount++;
            } 
            else if (gameState[index] === 'O'){
                oCount++;
            } 
            else {
                emptyCount++;
            }
        }

        //check good states for X
        if (xCount === 3 && emptyCount === 1){
            score += 100;
        }
        if (xCount === 2 && emptyCount === 2){
            score += 5;
        }  
        if (xCount === 1 && emptyCount === 3) {
            score += 1;
        }

        //get good states for o
        if (oCount === 3 && emptyCount === 1){
            score -= 100;
        }
        if (oCount === 2 && emptyCount === 2){
            score -= 5;
        }
        if (oCount === 1 && emptyCount === 3) {
            score -= 1;
        }
    }

    return score;
}

const getLowestEmptySquare = (squares, column) => {
    for (let index = 5; index >= 0; index--) {
        const columnIndex = index * 7 + column;
        if (squares[columnIndex] === null){
            return columnIndex;
        } 
    }
    return -1;
}

// Runs whichever search is selected: Alpha-Beta (usePruning = true) or plain Minimax (false)
const search = (GameState, depth, isMaximizing, usePruning) => {
    if (usePruning) {
        return minimax(GameState, depth, -Infinity, Infinity, isMaximizing);
    }
    return minimaxNoPruning(GameState, depth, isMaximizing);
}

//makes the best move on the board
const bestMove = (GameState, depth, usePruning) => {
    const buttons = document.getElementsByClassName('square');
    let bestScore = -Infinity;
    let move;
    let alpha = -Infinity; // worst possible score for max player
    let beta = Infinity; // worst possible score for min player
    //reset the nodes examined counter for this move
    nodesExamined = 0;
    const start = performance.now();
    for (let index = 0; index < 7; index++) {
        const columnIndex = getLowestEmptySquare(GameState, index);
        if (columnIndex !== -1){
            GameState[columnIndex] = 'X'; 
            let score = search(GameState, depth, false, usePruning);
            GameState[columnIndex] = null; 
            if (score > bestScore){
                bestScore = score;
                move = columnIndex;
            }
        }
    }
    // log the results of the search
    const ms = performance.now() - start;
    console.log(`X | ${usePruning ? 'Alpha-Beta' : 'Minimax'} | depth ${depth} | column ${move % 7} | ${nodesExamined} boards | ${ms.toFixed(1)} ms`);
    buttons[move].click();
    // make the best move on the board
    GameState[move] = 'X'; 
}

const bestMoveO = (GameState, depth, usePruning) => {
  const buttons = document.getElementsByClassName('square');
  let bestScore = Infinity;                       // 1. start HIGH (O wants low scores)
  let move;

  nodesExamined = 0;   // reset the nodes examined counter for this move
  const start = performance.now();
  for (let index = 0; index < 7; index++) {
    const columnIndex = getLowestEmptySquare(GameState, index);
    if (columnIndex !== -1) {
      GameState[columnIndex] = 'O';               // 2. try the move as O
      let score = search(GameState, depth, true, usePruning);  // 3. X replies next → maximizing
      GameState[columnIndex] = null;
      if (score < bestScore) {                    // 4. keep the LOWEST score
        bestScore = score;
        move = columnIndex;
      }
    }
  }
  const ms = performance.now() - start;
  console.log(`O | ${usePruning ? 'Alpha-Beta' : 'Minimax'} | depth ${depth} | column ${move % 7} | ${nodesExamined} boards | ${ms.toFixed(1)} ms`);
  buttons[move].click();
}

//returns the score of the best path
const minimax = (GameState, depth, alpha, beta, isMaximizing) => { //try to re-write this with your new knowledge + add depth(Score + depth)
    nodesExamined++;
    // Base case: check for a winner or tie
    let result = calculateWinner(GameState);
    if (result === 'X') {
        return scores.X + depth;
    }

    if (result === 'O') {
        return scores.O - depth;
    }

    if (!GameState.includes(null)) {
        return scores.tie;
    }

    if (depth === 0) {
        return evaluateBoard(GameState);
    }
    
    // Recursive case: maximize or minimize the score
    if (isMaximizing){
        let bestScore = -Infinity;
        for (let index = 0; index < 7; index++) {
            const columnIndex = getLowestEmptySquare(GameState, index);
            if (columnIndex !== -1) {
                GameState[columnIndex] = 'X'; 
                let score = minimax(GameState, depth - 1, alpha, beta, false);
                GameState[columnIndex] = null; 
                bestScore = max(score, bestScore);
                alpha = max(alpha, score);
                if (beta <= alpha){ //check to see if min has better available move
                    break;
                }
            }
        }
    return bestScore;
    } else {
        let bestScore = Infinity;
        for (let index = 0; index < 7; index++) {
            const columnIndex = getLowestEmptySquare(GameState, index);
            if (columnIndex !== -1){
                GameState[columnIndex] = 'O'; 
                let score = minimax(GameState, depth - 1, alpha, beta, true);
                GameState[columnIndex] = null; 
                bestScore = min(score, bestScore);
                beta = min(beta, score);
                if (beta <= alpha) { // if beta is greater than or equal to 
                    break;
                }
            }
        }
    return bestScore;
    }
}

// Plain Minimax: same as minimax, but searches every branch (no alpha-beta)
const minimaxNoPruning = (GameState, depth, isMaximizing) => {
    nodesExamined++;
    let result = calculateWinner(GameState);
    if (result === 'X') {
        return scores.X + depth;
    }
    if (result === 'O') {
        return scores.O - depth;
    }
    if (!GameState.includes(null)) {
        return scores.tie;
    }
    if (depth === 0) {
        return evaluateBoard(GameState);
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let index = 0; index < 7; index++) {
            const columnIndex = getLowestEmptySquare(GameState, index);
            if (columnIndex !== -1) {
                GameState[columnIndex] = 'X';
                let score = minimaxNoPruning(GameState, depth - 1, false);
                GameState[columnIndex] = null;
                bestScore = max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let index = 0; index < 7; index++) {
            const columnIndex = getLowestEmptySquare(GameState, index);
            if (columnIndex !== -1) {
                GameState[columnIndex] = 'O';
                let score = minimaxNoPruning(GameState, depth - 1, true);
                GameState[columnIndex] = null;
                bestScore = min(score, bestScore);
            }
        }
        return bestScore;
    }
};


export { bestMove, bestMoveO, calculateWinner, getLowestEmptySquare };