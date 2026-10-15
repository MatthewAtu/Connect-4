// Experiment 1 (simple version): Minimax vs. Alpha-Beta on the same board positions.
// Run from the Connect-4 folder:  node experiments/experiment1_simple.mjs
import { readFileSync, writeFileSync } from 'fs';
import { chooseMove } from '../src/logic.js';

const DEPTH = 4;

// 1. Load the saved test positions
const positions = JSON.parse(readFileSync('experiments/positions.json', 'utf8'));

// 2. The first line of the CSV: the column names
const csvLines = ['Id,Stage,MM column,AB column,Same move,MM boards,AB boards,AB branches pruned,% saved,MM time (ms),AB time (ms)'];

// 3. Test each position with both algorithms
for (const position of positions) {
  const board = position.board.flat();   // one flat list of 42 cells

  const mm = chooseMove(board.slice(), 'X', DEPTH, false);  // plain Minimax
  const ab = chooseMove(board.slice(), 'X', DEPTH, true);   // Alpha-Beta

  const mmColumn = mm.move % 7;
  const abColumn = ab.move % 7;
  const sameMove = mmColumn === abColumn;
  const percentSaved = 100 * (1 - ab.boardsExamined / mm.boardsExamined);

  // 4. Show the result in the terminal
  console.log(`Position ${position.id}: MM ${mm.boardsExamined} boards, AB ${ab.boardsExamined} boards, same move: ${sameMove}`);

  // 5. Add one row to the CSV
  csvLines.push([
    position.id,
    position.stage,
    mmColumn,
    abColumn,
    sameMove,
    mm.boardsExamined,
    ab.boardsExamined,
    ab.branchesPruned,
    percentSaved.toFixed(1),
    mm.timeMs.toFixed(2),
    ab.timeMs.toFixed(2),
  ].join(','));
}

// 6. Save the CSV file
writeFileSync('experiments/experiment1_results.csv', csvLines.join('\n'));
console.log('Saved results to experiments/experiment1_results.csv');