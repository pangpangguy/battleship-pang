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

export const generateRandomBoard = (): CellInfo[][] => {
  const board = generateBoard();

  // Randomly place ships on board
  shipList.forEach((ship) => {
    //Select a random starting point on the board that is valid for the current ship, assuming that it is horizontal
    //If the ship is vertical, the starting point must be within the range of the boardSize - shipSize
    //This is to ensure that the ship does not go out of bounds
    let row = Math.floor(Math.random() * boardSize);
    let col = Math.floor(Math.random() * (boardSize - ship.size));
    for (let i = 0; i < ship.size; i++) {
      board[row][col + i].cellState = CellState.Occupied;
    }
  });

  return board;
};

console.log(generateRandomBoard());
