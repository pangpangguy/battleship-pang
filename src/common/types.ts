import { useEffect, useRef, useState } from "react";

export interface ShipInterface {
  name: string;
  size: number;
  acronym: string;
  orientation: "horizontal" | "vertical";
  onBoard: boolean;
}

export interface CellInterface {
  cellId: string;
  cellState: CellState | null;
}

export interface SelectedShipInterface {
  shipName: String;
  shipPosition: Position;
}

export interface Position {
  xCoord: number;
  yCoord: number;
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
