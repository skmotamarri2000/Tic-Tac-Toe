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
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [size, setSize] = useState(3); // Setting the default size of the board as 3 x 3
  const [squares, setSquares] = useState(Array(size * size).fill(null));
  const [color, setColor] = useState(Array(size * size).fill("white"));
  const [inputSize, setInputSize] = useState("");

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
    setSquares(Array(size * size).fill(null));
    setGameStarted(false);
    setGameOver(false);
    setXIsNext(true);
    setColor(Array(size * size).fill("white"));
  }

  function handleSizeSubmit(event) {
    event.preventDefault();
    if (inputSize >= 3) {
      setSize(parseInt(inputSize));
      setSquares(Array(parseInt(inputSize) * parseInt(inputSize)).fill(null));
      setColor(Array(parseInt(inputSize) * parseInt(inputSize)).fill("white"));
      setGameStarted(true);
    }
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
      {!gameStarted && (
        <div>
          <h1 className="title">Welcome to Tic-Tac-Toe Game!</h1>
          <form onSubmit={handleSizeSubmit} className="input-container">
            <label htmlFor="boardSize" className="input-label">
              Enter Board Size (min 3):
            </label>
            <input
              type="number"
              id="boardSize"
              name="boardSize"
              min="3"
              value={inputSize}
              onChange={(e) => setInputSize(e.target.value)}
              className="input-field"
            />
            <button type="submit" className="submit-button">
              Start
            </button>
          </form>
        </div>
      )}

      {gameStarted && status}

      {gameStarted && (
        <div
          className="board"
          style={{ gridTemplateColumns: `repeat(${size}, 80px)` }}
        >
          {squares.map((value, index) => (
            <Square
              key={index}
              value={value}
              onSquareClick={() => handleClick(index)}
              color={color[index]}
            />
          ))}
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
  const size = Math.sqrt(squares.length);
  const lines = [];

  for (let i = 0; i < size; i++) {
    lines.push(Array.from({ length: size }, (_, index) => i * size + index));
  }

  for (let i = 0; i < size; i++) {
    lines.push(Array.from({ length: size }, (_, index) => i + index * size));
  }

  lines.push(Array.from({ length: size }, (_, index) => index * (size + 1)));
  lines.push(
    Array.from({ length: size }, (_, index) => (index + 1) * (size - 1))
  );

  for (let line of lines) {
    const lineSquares = line.map((index) => squares[index]);
    const firstSquare = lineSquares[0];
    if (firstSquare && lineSquares.every((square) => square === firstSquare)) {
      return firstSquare;
    }
  }

  return null;
}
