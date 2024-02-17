import React, { useState } from "react";
import "./style.css";

function Square({ value, onSquareClick, color }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{ backgroundColor: color }}
    >
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [color, setColor] = useState(Array(9).fill("white"));

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i] || gameOver) {
      return;
    }
    const nextSquares = squares.slice();

    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);

    const newColors = color.slice();
    newColors[i] = xIsNext ? "red" : "blue";
    setColor(newColors);

    setXIsNext(!xIsNext);

    if (calculateWinner(nextSquares) || nextSquares.every((square) => square)) {
      setGameOver(true);
    }
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setGameStarted(false);
    setGameOver(false);
    setXIsNext(true);
    setColor(Array(9).fill("white"));
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = (
      <div className="status winner">
        Winner: <span style={{ fontSize: "50px" }}>{winner}</span>
      </div>
    );
  } else if (squares.every((square) => square)) {
    status = <div className="status winner">Game Draw</div>;
  } else {
    status = (
      <div className="status">{xIsNext ? "Player 1: X" : "Player 2: O"}</div>
    );
  }

  return (
    <div className="container">
      {gameStarted && status}
      {gameStarted && (
        <>
          <div className="board">
            {squares.map((value, index) => (
              <Square
                key={index}
                value={value}
                onSquareClick={() => handleClick(index)}
                color={color[index]}
              />
            ))}
          </div>
        </>
      )}
      {!gameStarted && (
        <div>
          <h1 className="title">Welcome to Tic-Tac-Toe Game!</h1>

          <div className="start-button-container">
            <button
              className="start-button"
              onClick={() => setGameStarted(true)}
            >
              Start
            </button>
          </div>
        </div>
      )}

      {gameOver && (
        <div>
          <button className="reset-button" onClick={resetGame}>
            Reset Game
          </button>
        </div>
      )}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
