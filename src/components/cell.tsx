import { CellInterface, CellState } from "../common/types";
import "./cell.css";
import classNames from "classnames";

interface CellProps {
  cell: CellInterface;
  hovered: boolean;
  handleMouseEnter: (cellId: string) => void;
  handleMouseLeave: (cellId: string) => void;
  handleMouseClick: (cellId: string) => void;
}

export default function Cell({ cell, hovered, handleMouseEnter, handleMouseLeave, handleMouseClick }: CellProps) {
  return (
    <div
      onMouseEnter={(e) => {
        handleMouseEnter(cell.cellId);
      }}
      onMouseLeave={(e) => {
        handleMouseLeave(cell.cellId);
      }}
      className={classNames("cell", {
        header: cell.cellId.length <= 1 || cell.cellId === "10",
        hovered: hovered,
        occupied: cell.state === CellState.Occupied,
      })}
      onClick={() => {
        handleMouseClick(cell.cellId);
      }}
    >
      {cell.cellId}
    </div>
  );
}
