// Makes the test positions for Experiment 1 and saves them to positions.json.
// Run from the project folder:  node experiments/positions.mjs
import { writeFileSync } from 'fs';
import { calculateWinner, getLowestEmptySquare } from '../src/logic.js';

// // A random number generator that gives the SAME numbers every run for the same seed,
// // so everyone in the group gets the exact same 40 positions.
// function seededRandom(seed) {
//   return () => {
//     seed = (seed * 1664525 + 1013904223) % 4294967296;
//     return seed / 4294967296;
//   };
// }

// Plays `moves` random legal moves from an empty board.
// Returns the board, or null if someone won or the board filled up on the way.
function randomPosition(moves) {
  const board = Array(42).fill(null);
  let player = 'X';
  for (let i = 0; i < moves; i++) {
    const openColumns = [0, 1, 2, 3, 4, 5, 6].filter((c) => getLowestEmptySquare(board, c) !== -1);
    const column = openColumns[Math.floor(Math.random() * openColumns.length)];
    board[getLowestEmptySquare(board, column)] = player;
    player = player === 'X' ? 'O' : 'X';
    if (calculateWinner(board)) return null;   // game already over: throw it away
  }
  return board;
}

function boardToGrid(board) {
  const grid = [];
  for (let row = 0; row < 6; row++) {
    grid.push(board.slice(row * 7, row * 7 + 7));
  }
  return grid;
}

// Turns the board into 6 lines of text, one per row, e.g. ". . O X . . ."
function boardToPicture(board) {
  return boardToGrid(board).map((row) => row.map((c) => c || '.').join(' '));
} 

// How many positions from each stage of the game, and how many moves deep each stage is.
// Even move counts only, so it is always X's turn.
const stages = [
  { name: 'early', count: 13, minMoves: 4,  maxMoves: 10 },
  { name: 'mid',   count: 14, minMoves: 12, maxMoves: 20 },
  { name: 'late',  count: 13, minMoves: 22, maxMoves: 30 },
];

// const random = seededRandom(3720);
const positions = [];

for (const stage of stages) {
  let made = 0;
  while (made < stage.count) {
    const steps = (stage.maxMoves - stage.minMoves) / 2 + 1;
    // const moves = stage.minMoves + 2 * Math.floor(random() * steps);
    // const board = randomPosition(moves, random);
    const moves = stage.minMoves + 2 * Math.floor(Math.random() * steps);
    const board = randomPosition(moves);
    if (board) {
      positions.push({ id: positions.length + 1, stage: stage.name, moves, picture: boardToPicture(board), board });     
      made++;
    }
  }
}

writeFileSync(new URL('./positions.json', import.meta.url), JSON.stringify(positions, null, 1));
console.log(`Saved ${positions.length} positions to experiments/positions.json`);

// Print one so you can see what they look like
const p = positions[20];
console.log(`\nPosition ${p.id} (${p.stage} game, ${p.moves} moves played, X to move):`);
for (let r = 0; r < 6; r++) console.log(p.board.slice(r * 7, r * 7 + 7).map((c) => c || '.').join(' '));
