import { useEffect, useRef, useState } from "react";

export interface Ship {
  name: string;
  size: number;
  acronym: string;
}

export interface PregameShip extends Ship {
  onBoard: boolean;
  orientation: "horizontal" | "vertical";
}

export interface CellInfo {
  cellId: string;
  cellState: CellState;
  discovered: boolean;
}

export type HoverState = "valid" | "invalid" | null;

export interface Position {
  x: number;
  y: number;
}

export enum CellState {
  Unoccupied,
  Occupied,
  Hit,
  Miss,
  Sunk,
}
