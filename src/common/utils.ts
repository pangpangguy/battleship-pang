//Util functions used commonly throughout the code.
import { useEffect, useRef, useState } from "react";
import { CellInfo, GameStartCellInfo, HoverState, PregameCellInfo } from "./types";
import { boardSize } from "./constants";

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
      cols.push({ cellId: createCellId(row + 1, col) });
    }
    output.push(cols);
  }
  return output;
};

export const generatePregameBoard = (): PregameCellInfo[][] => {
  const board = generateBoard();
  return board.map((cellRow) => cellRow.map((cell) => ({ ...cell, hoverState: HoverState.None })));
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

//Type guards

export function isPregameCellInfo(cell: CellInfo): cell is PregameCellInfo {
  return (cell as PregameCellInfo).hoverState !== undefined;
}

export function isGameStartCellInfo(cell: CellInfo): cell is GameStartCellInfo {
  return (cell as GameStartCellInfo).isDiscovered !== undefined && (cell as GameStartCellInfo).cellState !== undefined;
}

export function cellHasShip(cell: CellInfo): cell is CellInfo & { shipId: string } {
  return "shipId" in cell && typeof cell.shipId === "string";
}
