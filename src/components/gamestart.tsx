import { useState } from "react";
import { CellInfo } from "../common/types";
import { generateBoard } from "../common/constants";
import Board from "./board";
import "./gamestart.css";

export default function GameStart() {
  const [playerBoard, setPlayerBoard] = useState<CellInfo[][]>(generateBoard());
  const [opponentBoard, setOpponentBoard] = useState<CellInfo[][]>(generateBoard());

  return (
    <div className="container">
      <div className="opponent-board">
        <h1>Select a cell to attack:</h1>
        <Board
          board={opponentBoard}
          hoveredCells={[]}
          handleMouseEnter={function (id: string): void {}}
          handleMouseLeave={function (id: string): void {}}
          handleMouseClick={function (id: string): void {}}
        />
      </div>
      <div className="player-board">
        <h1>Your Board</h1>
        <Board
          board={playerBoard}
          hoveredCells={[]}
          handleMouseEnter={function (id: string): void {}}
          handleMouseLeave={function (id: string): void {}}
          handleMouseClick={function (id: string): void {}}
        />
      </div>
    </div>
  );
}
