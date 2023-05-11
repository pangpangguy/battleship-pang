import { CellInfo } from "../common/types";
import { useEffect, useState } from "react";
import { generateBoard, generateBoardWithShips } from "../common/utils";
import Board from "./board";
import "./gamestart.css";

export default function GameStart() {
  const [playerBoard, setPlayerBoard] = useState<CellInfo[][]>(generateBoard());
  const [opponentBoard, setOpponentBoard] = useState<CellInfo[][]>(generateBoard());

  //Randomly generates a board with random states for testing purposes
  //To be removed later
  useEffect(() => {
    setPlayerBoard(generateBoardWithShips());
  }, []);

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
            handleMouseClick={function (id: string): void {}}
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
