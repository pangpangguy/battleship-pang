import { useState } from "react";
import { CellInfo, CellState, GameStartCellInfo, HoverState } from "../common/types";
import "./cell.css";
import classNames from "classnames";

interface CellProps {
  cell: CellInfo;
  handleMouseEnter: (cellId: string) => void;
  handleMouseLeave: (cellId: string) => void;
  handleMouseClick: (cellId: string) => void;
}

export default function Cell({ cell, handleMouseEnter, handleMouseLeave, handleMouseClick }: CellProps) {
  return (
    <div
      onMouseEnter={() => {
        handleMouseEnter(cell.cellId);
      }}
      onMouseLeave={() => {
        handleMouseLeave(cell.cellId);
      }}
      className={classNames("cell", `${CellState[cell.cellState].toLowerCase()}`, {
        [`hovered--${HoverState[cell.hoverState].toLowerCase()}`]: cell.hoverState !== HoverState.None,
        discovered: "discovered" in cell && cell.isDiscovered === true,
      })}
      onClick={() => {
        handleMouseClick(cell.cellId);
      }}
    >
      {cell.cellId}
    </div>
  );
}
