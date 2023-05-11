import { CellInfo, CellState, HoverState } from "../common/types";
import "./cell.css";
import classNames from "classnames";

interface CellProps {
  isHovered: HoverState;
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
      className={classNames("cell", `${CellState[cell.cellState].toLowerCase()}`, {
        hovered: isHovered === "valid",
        "hovered--invalid": isHovered === "invalid",
        discovered: cell.discovered,
      })}
      onClick={() => {
        handleMouseClick(cell.cellId);
      }}
    >
      {cell.cellId}
    </div>
  );
}
