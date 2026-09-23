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
            if (gameState[index] === 'O'){
                oCount++;
            } else {
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

//makes the best move on the board
const bestMove = (GameState) => {
    const buttons = document.getElementsByClassName('square');
    let bestScore = -Infinity;
    let move;
    let alpha = -Infinity; // worst possible score for max player
    let beta = Infinity; // worst possible score for min player
    for (let index = 0; index < 7; index++) {
        const columnIndex = getLowestEmptySquare(GameState, index);
        if (columnIndex !== -1){
            GameState[columnIndex] = 'X'; 
            let score = minimax(GameState, 8, alpha, beta, false);
            GameState[columnIndex] = null; 
            if (score > bestScore){
                bestScore = score;
                move = columnIndex;
            }
        }
    }
    buttons[move].click();
    GameState[move] = 'X'; 
}

//returns the score of the best path
const minimax = (GameState, depth, alpha, beta, isMaximizing) => { //try to re-write this with your new knowledge + add depth(Score + depth)
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


export { bestMove, calculateWinner, getLowestEmptySquare };