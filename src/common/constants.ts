import { CellInfo, CellState, Ship } from "./types";

export const shipList: Ship[] = [
  { name: "Carrier", size: 5, acronym: "CR" },
  { name: "Battleship", size: 4, acronym: "BS" },
  { name: "Destroyer", size: 3, acronym: "DT" },
  { name: "Submarine", size: 3, acronym: "SB" },
  { name: "Patrol Boat", size: 2, acronym: "PB" },
];

export const boardSize = 10;

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
