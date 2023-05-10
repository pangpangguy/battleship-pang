//Util functions used commonly throughout the code.
import { useEffect, useRef, useState } from "react";
import { CellInfo, CellState } from "./types";
import { boardSize } from "./constants";

//useStateRef is a custom hook that returns a ref to the state, as well as the state itself.
export function useStateRef(initialValue: any) {
  const [value, setValue] = useState(initialValue);

  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return [value, setValue, ref];
}

//Function to create the cellId from the row and column input
//Row is between 1 and 10
//Col is between A and J. If a number is passed, it is converted to the corresponding letter
export function createCellId(row: number, col: number | string): string {
  const colHeader = typeof col === "string" ? col : String.fromCharCode("A".charCodeAt(0) + col);

  return `${row}-${colHeader}`;
}

//Function to generate the board
export const generateCells = (): CellInfo[][] => {
  const output: CellInfo[][] = [];
  for (let row = 0; row < boardSize; row++) {
    const cols: CellInfo[] = [];

    for (let col = 0; col < boardSize; col++) {
      cols.push({ cellId: createCellId(row + 1, col), state: CellState.Unoccupied });
    }
    output.push(cols);
  }
  return output;
};
