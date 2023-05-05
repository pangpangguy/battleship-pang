import { CellInterface, CellState } from "./types";

export const shipList = [
  { name: "Carrier", size: 5, acronym: "CR" },
  { name: "Battleship", size: 4, acronym: "BS" },
  { name: "Destroyer", size: 3, acronym: "DT" },
  { name: "Submarine", size: 3, acronym: "SB" },
  { name: "Patrol Boat", size: 2, acronym: "PB" },
];

export const boardSize: number = 11;

export const generateCells = (): CellInterface[][] => {
  const output: CellInterface[][] = [];
  for (let row = 0; row < boardSize - 1; row++) {
    const cols: CellInterface[] = [];

    for (let col = 0; col < boardSize - 1; col++) {
      const colHeader: string = String.fromCharCode("A".charCodeAt(0) + col);
      const cellId: string = `${row + 1}-${colHeader}`;

      cols.push({ cellId: cellId, state: CellState.Unoccupied });
    }
    output.push(cols);
  }
  return output;
};
