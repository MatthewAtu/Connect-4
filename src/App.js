import { useState, useEffect, useRef } from 'react';
import { bestMove, calculateWinner, getLowestEmptySquare } from './logic';

function Square({ value, onSquareClick }) {
  return (
    <button 
      className="square" 
      onClick={onSquareClick}     
      style={{
        width: '50px',
        height: '50px',
        minWidth: '50px',
        maxWidth: '50px',
        minHeight: '50px',
        maxHeight: '50px',
        padding: 0,
        margin: 0,
        boxSizing: 'border-box',
        border: '1px solid black',
        borderRadius: 0,
        fontSize: '24px',
        flex: '0 0 50px'
      }}
    >
      {value}
    </button>
  );
}

const contains = (Array, value) => {
  for (let i = 0; i < Array.length; i++) {
    if(Array[i] === value){
      return true;
    }
  }
  return false;
}

function Board({ xIsNext, squares, onPlay }) {
  const nextSquares = squares.slice();
  const hasMoved = useRef(false);
  function handleClick(i) {//get the index of the clicked square and place the corresponting shape there
    const column = i % 7;
    if (calculateWinner(squares)) {
      return;
    }

    const index = getLowestEmptySquare(nextSquares, column);

    if (index === -1){
      alert("Row is Full");
      return;
    }

    if (!xIsNext) {
      nextSquares[index] = 'O';
    }

    onPlay(nextSquares);
  }

  useEffect(() =>{
    if (xIsNext && !hasMoved.current) {
      hasMoved.current = true;
      bestMove(nextSquares);
    }

    if (!xIsNext) {
      hasMoved.current = false;
    }
  });

  const rowStyle = {
    display: 'flex',
    width: '350px',
    height: '50px'
  };

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (!contains(squares, null)) {
    status = 'Tie';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  } 

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row" style={rowStyle}>
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
      </div>
      <div className="board-row" style={rowStyle}>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        <Square value={squares[9]} onSquareClick={() => handleClick(9)} />
        <Square value={squares[10]} onSquareClick={() => handleClick(10)} />
        <Square value={squares[11]} onSquareClick={() => handleClick(11)} />
        <Square value={squares[12]} onSquareClick={() => handleClick(12)} />
        <Square value={squares[13]} onSquareClick={() => handleClick(13)} />
      </div>
      <div className="board-row" style={rowStyle}>
        <Square value={squares[14]} onSquareClick={() => handleClick(14)} />
        <Square value={squares[15]} onSquareClick={() => handleClick(15)} />
        <Square value={squares[16]} onSquareClick={() => handleClick(16)} />
        <Square value={squares[17]} onSquareClick={() => handleClick(17)} />
        <Square value={squares[18]} onSquareClick={() => handleClick(18)} />
        <Square value={squares[19]} onSquareClick={() => handleClick(19)} />
        <Square value={squares[20]} onSquareClick={() => handleClick(20)} />
      </div>
      <div className="board-row" style={rowStyle}>
        <Square value={squares[21]} onSquareClick={() => handleClick(21)} />
        <Square value={squares[22]} onSquareClick={() => handleClick(22)} />
        <Square value={squares[23]} onSquareClick={() => handleClick(23)} />
        <Square value={squares[24]} onSquareClick={() => handleClick(24)} />
        <Square value={squares[25]} onSquareClick={() => handleClick(25)} />
        <Square value={squares[26]} onSquareClick={() => handleClick(26)} />
        <Square value={squares[27]} onSquareClick={() => handleClick(27)} />
      </div>
      <div className="board-row" style={rowStyle}>
        <Square value={squares[28]} onSquareClick={() => handleClick(28)} />
        <Square value={squares[29]} onSquareClick={() => handleClick(29)} />
        <Square value={squares[30]} onSquareClick={() => handleClick(30)} />
        <Square value={squares[31]} onSquareClick={() => handleClick(31)} />
        <Square value={squares[32]} onSquareClick={() => handleClick(32)} />
        <Square value={squares[33]} onSquareClick={() => handleClick(33)} />
        <Square value={squares[34]} onSquareClick={() => handleClick(34)} />
      </div>
      <div className="board-row" style={rowStyle}>
        <Square value={squares[35]} onSquareClick={() => handleClick(35)} />
        <Square value={squares[36]} onSquareClick={() => handleClick(36)} />
        <Square value={squares[37]} onSquareClick={() => handleClick(37)} />
        <Square value={squares[38]} onSquareClick={() => handleClick(38)} />
        <Square value={squares[39]} onSquareClick={() => handleClick(39)} />
        <Square value={squares[40]} onSquareClick={() => handleClick(40)} />
        <Square value={squares[41]} onSquareClick={() => handleClick(41)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(42).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  //if the number is even it is X's Turn
  // if this is true then it is the AI's Turn to
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        AI vs. player
      </div>
    </div>
  );
}
