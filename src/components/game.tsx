import { useState, useCallback } from "react";
import { CellInterface, CellState } from "../common/types";
import Board from "./board";
import ShipPlacement from "./ship-placement";

export default function Game() {
  const size: number = 11;
  const generateCells = () => {
    const output: CellInterface[][] = [];
    for (let row = 0; row < size - 1; row++) {
      const cols: CellInterface[] = [];

      for (let col = 0; col < size - 1; col++) {
        const colHeader: string = String.fromCharCode("A".charCodeAt(0) + col);
        const cellId: string = `${row + 1}-${colHeader}`;

        cols.push({ cellId: cellId, state: CellState.Unoccupied, hovered: false });
      }
      output.push(cols);
    }
    return output;
  };
  const [board, setBoard] = useState(generateCells());
  const handleMouseEnter = useCallback((id: string) => {
    if (id.length <= 1 || id === "10") return;

    const newBoard = board.map((rowCells) => {
      return rowCells.map((cell) => {
        if (cell.cellId === id) {
          console.log(`entered ${id}`);
          return { ...cell, hovered: true };
        } else return { ...cell };
      });
    });
    setBoard(newBoard);
  }, []);

  const handleMouseLeave = useCallback((id: string) => {
    if (id.length <= 1 || id === "10") return;

    const newBoard = board.map((rowCells) => {
      return rowCells.map((cell) => {
        if (cell.cellId === id) {
          console.log(`left ${id}`);
          return { ...cell, hovered: false };
        } else return { ...cell };
      });
    });

    setBoard(newBoard);
  }, []);

  return (
    <>
      <Board board={board} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
      <ShipPlacement />
    </>
  );
}
