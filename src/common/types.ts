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
  cellState: CellState | null;
}

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

//useStateRef is a custom hook that returns a ref to the state, as well as the state itself.
export function useStateRef(initialValue: any) {
  const [value, setValue] = useState(initialValue);

  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return [value, setValue, ref];
}
