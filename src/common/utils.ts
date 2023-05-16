//Util functions used commonly throughout the code.
import { useEffect, useRef, useState } from "react";
import { CellInfo, CellState, GamePhase, GameStartCellInfo, HoverState } from "./types";
import { boardSize, shipList } from "./constants";

//Function to create the cellId from the row and column input
//Row is between 1 and 10
//Col is between A and J. If a number is passed, it is converted to the corresponding letter
export function createCellId(row: number, col: number | string): string {
  const colHeader = typeof col === "string" ? col : String.fromCharCode("A".charCodeAt(0) + col);

  return `${row}-${colHeader}`;
}

export const generateBoard = (): CellInfo[][] => {
  const output: CellInfo[][] = [];
  for (let row = 0; row < boardSize; row++) {
    const cols: CellInfo[] = [];

    for (let col = 0; col < boardSize; col++) {
      cols.push({ cellId: createCellId(row + 1, col), cellState: CellState.Unoccupied, hoverState: HoverState.None });
    }
    output.push(cols);
  }
  return output;
};

//Generates a board with random ship placements
export const generateBoardWithShips = (): CellInfo[][] => {
  const board = generateBoard();
  const occupiedCells = new Set<string>();

  //Get a random number between 0 and max-1
  const getRandomNumber = (max: number): number => {
    return Math.floor(Math.random() * max);
  };

  //Checks if a position is valid
  const isValidPosition = (row: number, col: number, shipSize: number, orientation: number): boolean => {
    // If the ship is out of bounds or overlaps with another ship, return false
    for (let i = 0; i < shipSize; i++) {
      if (
        row + i > boardSize ||
        col + (orientation ? 0 : i) > boardSize ||
        occupiedCells.has(`${row + (orientation ? i : 0)}-${col + (orientation ? 0 : i)}`)
      ) {
        return false;
      }
    }
    // If we made it through the loop without returning, the position is valid
    return true;
  };

  // Randomly place ships on board
  shipList.forEach((ship) => {
    //Select a random starting point on the board that is valid for the current ship
    //If the ship is vertical, the starting point must be within the range of the boardSize - shipSize
    //This is to ensure that the ship does not go out of bounds
    const max = boardSize - ship.size;
    var row, col, orientation;
    do {
      //Randomly select an orientation for the ship
      orientation = Math.floor(Math.random() * 2);

      //Based on the orientation, select a random starting point
      row = orientation === 0 ? getRandomNumber(boardSize) : getRandomNumber(max);
      col = orientation === 1 ? getRandomNumber(boardSize) : getRandomNumber(max);
    } while (!isValidPosition(row, col, ship.size, orientation));

    for (let i = 0; i < ship.size; i++) {
      if (orientation) {
        //Vertical
        board[row + i][col].cellState = CellState.Occupied;
        occupiedCells.add(`${row + i}-${col}`);
      } else {
        board[row][col + i].cellState = CellState.Occupied;
        occupiedCells.add(`${row}-${col + i}`);
      }
    }
  });

  return board;
};

//useStateRef is a custom hook that returns a ref to the state, as well as the state itself.
//Used exclusively for eventlisteners since they are not updated correctly when using the state directly.
//The type is either T or (T | null) depending on if the initial value is null or not.
export function useStateRef<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return [value, setValue, ref] as const;
}
