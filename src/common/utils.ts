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

//Generates a board with random ship placements
export const generateBoardWithShips = (): CellInfo[][] => {
  const board = generateBoard();

  // Get random number from 0 to max
  const getRandomNumber = (max: number): number => {
    return Math.floor(Math.random() * max);
  };

  // Randomly place ships on board
  shipList.forEach((ship) => {
    //Select a random starting point on the board that is valid for the current ship
    //If the ship is vertical, the starting point must be within the range of the boardSize - shipSize
    //This is to ensure that the ship does not go out of bounds
    const max = boardSize - ship.size;

    //Randomly select an orientation for the ship
    const orientation = getRandomNumber(2);

    //Based on the orientation, select a random starting point
    let row = orientation === 1 ? getRandomNumber(boardSize - 1) : getRandomNumber(max);
    let col = orientation === 0 ? getRandomNumber(boardSize - 1) : getRandomNumber(max);

    console.log(`Placing ${ship.name} at ${row}, ${col} of orientation ${orientation} and size ${ship.size}`);

    for (let i = 0; i < ship.size; i++) {
      if (orientation) {
        //Vertical
        console.log(`${row + i}, ${col}`);
        board[row + i][col].cellState = CellState.Occupied;
      } else {
        //Horizontal
        board[row][col + i].cellState = CellState.Occupied;
      }
    }
  });

  return board;
};
