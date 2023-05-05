import { ReactElement } from "react";
import { ICell, CellState } from "../common/types";
import { boardSize } from "../common/constants";
import Cell from "./cell";
import "./board.css";

interface BoardProps {
  board: ICell[][];
  hoveredCells: string[];
  handleMouseEnter: (id: string) => void;
  handleMouseLeave: (id: string) => void;
  handleMouseClick: (id: string) => void;
}

export default function Board({
  board,
  hoveredCells,
  handleMouseEnter,
  handleMouseLeave,
  handleMouseClick,
}: BoardProps) {
  const generateGrid = () => {
    const grid: ReactElement[] = [];

    //Create first column for row header
    const headerCols: ReactElement[] = [];
    for (let i = 0; i <= boardSize; i++) {
      headerCols.push(
        <Cell
          cell={{ cellId: i.toString(), state: CellState.Header }}
          hovered={false}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          handleMouseClick={handleMouseClick}
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
    for (let col = 1; col < boardSize; col++) {
      const cols: ReactElement[] = [];

      //First cell in the column is the header (A to J)
      const colHeaderId: string = String.fromCharCode("A".charCodeAt(0) + col - 1);
      cols.push(
        <Cell
          cell={{ cellId: colHeaderId, state: CellState.Header }}
          hovered={false}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          handleMouseClick={handleMouseClick}
          key={colHeaderId}
        />
      );

      for (let row = 1; row <= boardSize; row++) {
        const cell: ICell = board[row - 1][col - 1];
        cols.push(
          <Cell
            cell={cell}
            hovered={hoveredCells.includes(cell.cellId)}
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
