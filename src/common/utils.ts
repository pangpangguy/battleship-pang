import { boardSize, shipList } from "./constants";
import { CellInfo, CellState } from "./types";

export const generateBoard = (): CellInfo[][] => {
  const output: CellInfo[][] = [];
  for (let row = 0; row < boardSize; row++) {
    const cols: CellInfo[] = [];

    for (let col = 0; col < boardSize; col++) {
      const colHeader: string = String.fromCharCode("A".charCodeAt(0) + col);
      const cellId: string = `${row + 1}-${colHeader}`;

      cols.push({ cellId: cellId, cellState: CellState.Unoccupied });
    }
    output.push(cols);
  }
  return output;
};
