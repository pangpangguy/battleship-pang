import { CellInfo, CellState, hoverState } from "../common/types";
import "./cell.css";
import classNames from "classnames";

interface CellProps {
  isHovered: hoverState;
  cell: CellInfo;
  handleMouseEnter: (cellId: string) => void;
  handleMouseLeave: (cellId: string) => void;
  handleMouseClick: (cellId: string) => void;
}

export default function Cell({ cell, isHovered, handleMouseEnter, handleMouseLeave, handleMouseClick }: CellProps) {
  return (
    <div
      onMouseEnter={() => {
        handleMouseEnter(cell.cellId);
      }}
      onMouseLeave={() => {
        handleMouseLeave(cell.cellId);
      }}
      className={classNames("cell", {
        hovered: isHovered === "valid",
        "hovered--invalid": isHovered === "invalid",
        occupied: cell.cellState === CellState.Occupied,
      })}
      onClick={() => {
        handleMouseClick(cell.cellId);
      }}
    >
      {cell.cellId}
    </div>
  );
}
