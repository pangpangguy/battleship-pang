import { ReactElement } from "react";
import { CellInfo, HoverState } from "../common/types";
import { boardSize } from "../common/constants";
import "./board.css";
import Cell from "./cell";

interface BoardProps {
  board: CellInfo[][];
  handleMouseEnter: (id: string) => void;
  handleMouseLeave: (id: string) => void;
  handleMouseClick: (id: string) => void;
}

export default function Board({ board, handleMouseEnter, handleMouseLeave, handleMouseClick }: BoardProps) {
  const generateGrid = () => {
    const grid: ReactElement[] = [];

    //Create first column for row header
    const headerCols: ReactElement[] = [];
    for (let i = 0; i <= boardSize; i++) {
      headerCols.push(
        <div className="cell header" key={i}>
          {i.toString()}
        </div>
      );
    }

    grid.push(
      <div className="col" key="Z">
        {headerCols}
      </div>
    );

    //Create the rest of grid, column by column
    for (let col = 0; col < boardSize; col++) {
      const cols: ReactElement[] = [];

      //First cell in the column is the header (A to J)
      const colHeaderId: string = String.fromCharCode("A".charCodeAt(0) + col);
      cols.push(
        <div className="cell header" key={colHeaderId}>
          {colHeaderId}
        </div>
      );

      //Construct the rest of the column
      for (let row = 0; row < boardSize; row++) {
        const cell: CellInfo = board[row][col];

        cols.push(
          <Cell
            cell={cell}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            handleMouseClick={handleMouseClick}
            key={cell.cellId}
          />
        );
      }

      grid.push(
        <div className="col" key={colHeaderId}>
          {cols}
        </div>
      );
    }

    return grid;
  };

  return <div className="board">{generateGrid()}</div>;
}
