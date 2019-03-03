// Board.js: Responsible for contructing the gameboard with smaller inner squares components
import React from "react";
import "../css/index.css";

function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

const Board = ({ board, onCellClick, playertype, size }) => {
  const status = "Your Symbol: " + playertype === "X";
  let figureBoard = [];

  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      let cell = (
        <Square value={board[i][j]} onClick={() => onCellClick(i, j)} />
      );

      row.push(cell); // add 'size' amount of cells at each row
    }

    row = <div className="board-row">{row}</div>;
    figureBoard.push(row); // add 'size' amount of rows
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-table">{figureBoard}</div>
    </div>
  );
};

export default Board;
