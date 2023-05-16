import { CellInfo, GameStartCellInfo } from "../common/types";
import Board from "./board";
import "./gamestart.css";

interface GameStartProps {
  playerBoard: CellInfo[][];
  opponentBoard: GameStartCellInfo[][];
  handleUpdateOpponentBoard: (newBoard: GameStartCellInfo[]) => void;
}
export default function GameStart({ playerBoard, opponentBoard, handleUpdateOpponentBoard }: GameStartProps) {
  function discoverCell(id: string): void {
    handleUpdateOpponentBoard(
      opponentBoard
        .flat()
        .filter((cell) => cell.cellId === id)
        .map((cell) => ({ ...cell, discovered: true }))
    );
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
