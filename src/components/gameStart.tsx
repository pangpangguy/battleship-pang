import { CellInfo, CellState } from "../common/types";
import { useEffect, useState } from "react";
import { generateBoard } from "../common/utils";
import Board from "./board";
import "./gamestart.css";

export default function GameStart() {
  const [playerBoard, setPlayerBoard] = useState<CellInfo[][]>(generateBoard());
  const [opponentBoard, setOpponentBoard] = useState<CellInfo[][]>(generateBoard());

  //Randomly generates a board with ships with random states for testing purposes
  //To be removed later
  useEffect(() => {
    const cellStates = Object.values(CellState).filter(
      (state) => typeof state === "string" && state !== "Occupied" && state !== "Unoccupied"
    );

    const generateRandomBoard = (): CellInfo[][] => {
      return generateBoard().map((row) => {
        return row.map((cell) => {
          const randomState = cellStates[Math.floor(Math.random() * cellStates.length)];
          cell.cellState = CellState[randomState as keyof typeof CellState];
          return cell;
        });
      });
    };

    setOpponentBoard(generateRandomBoard);
  }, []);

  //Handle cell selection
  function handleCellSelect(id: string): void {
    const newBoard = opponentBoard.map((row) => {
      return row.map((cell) => {
        if (cell.cellId === id && !cell.discovered) {
          return { ...cell, discovered: true };
        }
        return cell;
      });
    });

    setOpponentBoard(newBoard);
  }

  return (
    <div className="container">
      <div className="restart-btn-wrapper">
        <button className="restart-btn">Restart Game</button>
      </div>
      <div className="boards-wrapper">
        <div className="opponent-board">
          <h1>Select a cell to attack:</h1>
          <Board
            board={opponentBoard}
            hoveredCells={{ cells: [], isValid: false }}
            handleMouseEnter={function (id: string): void {}}
            handleMouseLeave={function (id: string): void {}}
            handleMouseClick={handleCellSelect}
          />
        </div>
        <div className="player-board">
          <h1>Your Board</h1>
          <Board
            board={playerBoard}
            hoveredCells={{ cells: [], isValid: false }}
            handleMouseEnter={function (id: string): void {}}
            handleMouseLeave={function (id: string): void {}}
            handleMouseClick={function (id: string): void {}}
          />
        </div>
      </div>
    </div>
  );
}
