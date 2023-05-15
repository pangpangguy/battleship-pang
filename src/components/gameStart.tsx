import { GameStartCellInfo, CellState, CellInfo, HoverState } from "../common/types";
import { useEffect, useState } from "react";
import { generateBoard } from "../common/utils";
import Board from "./board";
import "./gamestart.css";

export default function GameStart() {
  //Randomly generates a board with ships with random states for testing purposes
  //To be removed later
  const randomStates: (CellState.Hit | CellState.Miss | CellState.Sunk)[] = [
    CellState.Miss,
    CellState.Hit,
    CellState.Sunk,
  ];
  const generateRandomBoard = (): GameStartCellInfo[][] => {
    return generateBoard().map((cellRow) => {
      return cellRow.map((cell) => {
        const randomState: CellState = randomStates[Math.floor(Math.random() * randomStates.length)];
        return {
          ...cell,
          cellState: randomState,
          discovered: false,
          hoverState: HoverState.None,
        };
      });
    });
  };
  const [playerBoard, setPlayerBoard] = useState<CellInfo[][]>(generateBoard());
  const [opponentBoard, setOpponentBoard] = useState<GameStartCellInfo[][]>(generateRandomBoard());

  function discoverCell(id: string): void {
    const newBoard = opponentBoard.map((cellRow) => {
      return cellRow.map((cell) => {
        if (cell.cellId === id) {
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
            handleMouseEnter={function (id: string): void {}}
            handleMouseLeave={function (id: string): void {}}
            handleMouseClick={discoverCell}
          />
        </div>
        <div className="player-board">
          <h1>Your Board</h1>
          <Board
            board={playerBoard}
            handleMouseEnter={function (id: string): void {}}
            handleMouseLeave={function (id: string): void {}}
            handleMouseClick={function (id: string): void {}}
          />
        </div>
      </div>
    </div>
  );
}
