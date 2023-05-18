import { useState } from "react";
import { CellInfo, CellState, HoverState, PregameCellInfo } from "../common/types";
import "./cell.css";
import classNames from "classnames";

interface CellProps {
  cell: CellInfo;
  handleMouseEnter: (cellId: string) => void;
  handleMouseLeave: (cellId: string) => void;
  handleMouseClick: (cellId: string) => void;
}

export default function Cell({ cell, handleMouseEnter, handleMouseLeave, handleMouseClick }: CellProps) {
  function isPregameCell(cell: CellInfo): cell is PregameCellInfo {
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
        [`hovered--${isPregameCell(cell) && HoverState[cell.hoverState].toLowerCase()}`]:
          "hoverState" in cell && cell.hoverState !== HoverState.None,
        discovered: "isDiscovered" in cell && cell.isDiscovered === true,
      })}
      onClick={() => {
        handleMouseClick(cell.cellId);
      }}
    >
      {cell.cellId}
    </div>
  );
}
