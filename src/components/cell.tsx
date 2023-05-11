import { CSSProperties, useState } from "react";
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
  const [animationPhase, setAnimationPhase] = useState<0 | 1 | 2>(0);

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
        if (cell.discovered) return;
        setAnimationPhase(1);
        setTimeout(() => {
          setAnimationPhase(2);
        }, 500);
        handleMouseClick(cell.cellId);
      }}
    >
      <span
        className={classNames("state-animation", {
          "state-animation--start": animationPhase === 1,
          "state-animation--end": animationPhase === 2,
        })}
      >
        {CellState[cell.cellState]}
      </span>
      {cell.cellId}
    </div>
  );
}
