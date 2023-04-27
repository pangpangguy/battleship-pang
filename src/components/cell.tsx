import { CellInterface } from "../common/types";
import "./cell.css";
import classNames from "classnames";

interface CellProps {
  cell: CellInterface;
  handleMouseEnter: (cellId: string) => void;
  handleMouseLeave: (cellId: string) => void;
}

export default function Cell({ cell, handleMouseEnter, handleMouseLeave }: CellProps) {
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
        hovered: cell.hovered,
      })}
    >
      {cell.cellId}
    </div>
  );
}
