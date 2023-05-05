import { CellInterface } from "../common/types";
import "./board.css";
import Cell from "./cell";
import { ReactElement } from "react";
import { boardSize } from "../common/constants";

interface BoardProps {
  board: CellInterface[][];
  hoveredCells: { cells: string[]; isValid: boolean };
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
  const generateGrid = (): ReactElement[] => {
    const grid: ReactElement[] = [];

    //Create first column for row header
    const headerCols = [];
    for (let i = 0; i < boardSize; i++) {
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
    for (let col = 1; col < boardSize; col++) {
      const cols = [];

      //First cell in the column is the header (A to J)
      const colHeaderId: string = String.fromCharCode("A".charCodeAt(0) + col - 1);
      cols.push(
        <div className="cell header" key={colHeaderId}>
          {colHeaderId}
        </div>
      );

      //Construct the rest of the column
      for (let row = 1; row < boardSize; row++) {
        const cell = board[row - 1][col - 1];
        //Check if the cell is hovered
        const cellIsHovered: "valid" | "invalid" | null = hoveredCells.cells.includes(cell.cellId)
          ? hoveredCells.isValid
            ? "valid"
            : "invalid"
          : null;

        cols.push(
          <Cell
            cell={cell}
            isHovered={cellIsHovered}
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
