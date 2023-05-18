import { CellInfo, CellState, GameStartCellInfo, HoverState, PregameCellInfo } from "../common/types";
import "./cell.css";
import classNames from "classnames";

interface CellProps {
  cell: CellInfo;
  handleMouseEnter: (cellId: string) => void;
  handleMouseLeave: (cellId: string) => void;
  handleMouseClick: (cellId: string) => void;
}

export default function Cell({ cell, handleMouseEnter, handleMouseLeave, handleMouseClick }: CellProps) {
  function checkIsPregameCellAndGetClassNames(cell: CellInfo): string | undefined {
    //Type guard for PregameCell
    if (isPregameCellInfo(cell)) {
      let classNamesToAdd: string[] = [
        //Adds hover state class name for cell if it has one (valid/invalid)
        cell.hoverState !== HoverState.None
          ? `hovered--${HoverState[(cell as PregameCellInfo).hoverState].toLowerCase()}`
          : "",

        //Adds 'occupied' if cell has a ship
        "shipId" in cell ? "occupied" : "",
      ];

      //Remove empty strings and return class names as a string
      return classNamesToAdd.filter((className) => className !== "").join(" ");
    }
  }

  function checkIsGameStartCellAndGetClassNames(cell: CellInfo): string | undefined {
    //Type guard for GameStartCell
    if (isGameStartCellInfo(cell)) {
      let classNamesToAdd: string[] = [
        //Adds cell state class name
        `${CellState[cell.cellState].toLowerCase()}`,

        //Adds 'occupied' if cell has a ship
        "shipId" in cell ? "occupied" : "",

        //Adds 'discovered' if cell has been discovered
        cell.discovered ? "discovered" : "",
      ];

      //Remove empty strings and return class names as a string
      return classNamesToAdd.filter((className) => className !== "").join(" ");
    }
  }

  //Type guards
  function isPregameCellInfo(cell: CellInfo): cell is PregameCellInfo {
    return (cell as PregameCellInfo).hoverState !== undefined;
  }

  function isGameStartCellInfo(cell: CellInfo): cell is GameStartCellInfo {
    return (cell as GameStartCellInfo).discovered !== undefined && (cell as GameStartCellInfo).cellState !== undefined;
  }

  return (
    <div
      onMouseEnter={() => {
        handleMouseEnter(cell.cellId);
      }}
      onMouseLeave={() => {
        handleMouseLeave(cell.cellId);
      }}
      className={classNames(
        "cell",
        checkIsPregameCellAndGetClassNames(cell),
        checkIsGameStartCellAndGetClassNames(cell)
      )}
      onClick={() => {
        handleMouseClick(cell.cellId);
      }}
    >
      {cell.cellId}
    </div>
  );
}
