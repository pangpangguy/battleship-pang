import { CellInterface } from "../common/types";
import "./board.css";
import Cell from "./cell";
import { CellState } from "../common/types";
import { ReactElement } from "react";

interface BoardProps {
  board: CellInterface[][];
  handleMouseEnter: (id: string) => void;
  handleMouseLeave: (id: string) => void;
}

export default function Board({ board, handleMouseEnter, handleMouseLeave }: BoardProps) {
  const size: number = 11;
  const generateGrid = () => {
    const grid: ReactElement[] = [];

    //Create first column for row header
    const headerCols = [];
    for (let i = 0; i < size; i++) {
      headerCols.push(
        <Cell
          cell={{ cellId: i.toString(), state: CellState.Header, hovered: false }}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          key={i}
        />
      );
    }

    grid.push(
      <div className="col" key="Z">
        {headerCols}
      </div>
    );

    //Create the rest of grid, column by column
    for (let col = 1; col < size; col++) {
      const cols = [];

      //First cell in the column is the header (A to J)
      const colHeaderId: string = String.fromCharCode("A".charCodeAt(0) + col - 1);
      cols.push(
        <Cell
          cell={{ cellId: colHeaderId, state: CellState.Header, hovered: false }}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          key={colHeaderId}
        />
      );

      for (let row = 1; row < size; row++) {
        const cell: CellInterface = board[row - 1][col - 1];
        cols.push(
          <Cell cell={cell} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} key={cell.cellId} />
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
