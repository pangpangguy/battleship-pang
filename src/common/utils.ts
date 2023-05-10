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

//Function to generate the board
export const generateCells = (): CellInfo[][] => {
  const output: CellInfo[][] = [];
  for (let row = 0; row < boardSize; row++) {
    const cols: CellInfo[] = [];

    for (let col = 0; col < boardSize; col++) {
      const colHeader: string = String.fromCharCode("A".charCodeAt(0) + col);
      const cellId: string = `${row + 1}-${colHeader}`;

      cols.push({ cellId: cellId, state: CellState.Unoccupied });
    }
    output.push(cols);
  }
  return output;
};
