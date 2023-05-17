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
  //Type guard
  function isPregameCell(cell: any): cell is PregameCellInfo {
    return "hoverState" in cell;
  }

  return (
    <div
      onMouseEnter={() => {
        handleMouseEnter(cell.cellId);
      }}
      onMouseLeave={() => {
        handleMouseLeave(cell.cellId);
      }}
      className={classNames("cell", `${CellState[cell.cellState].toLowerCase()}`, {
        [`hovered--${isPregameCell(cell) && HoverState[(cell as PregameCellInfo).hoverState].toLowerCase()}`]:
          (cell as PregameCellInfo).hoverState !== HoverState.None,
        discovered: "discovered" in cell && cell.discovered === true,
      })}
      onClick={() => {
        handleMouseClick(cell.cellId);
      }}
    >
      {cell.cellId}
    </div>
  );
}
