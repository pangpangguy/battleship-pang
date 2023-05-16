import { CellInfo, CellState, GameStartCellInfo } from "../common/types";
import Board from "./board";
import "./gamestart.css";

interface GameStartProps {
  playerBoard: CellInfo[][];
  opponentBoard: GameStartCellInfo[][];
  handleUpdateOpponentBoard: (newBoard: GameStartCellInfo[]) => void;
}
export default function GameStart({ playerBoard, opponentBoard, handleUpdateOpponentBoard }: GameStartProps) {
  type GameStartCellStates = CellState.Hit | CellState.Miss | CellState.Sunk;
  function discoverCell(id: string): void {
    handleUpdateOpponentBoard(
      opponentBoard
        .flat()
        .filter((cell) => cell.cellId === id)
        .map((cell) => ({ ...cell, discovered: true }))
    );
  }

  function showAnimationMessage(state: GameStartCellStates) {
    if (state === CellState.Hit) {
      setStatus("You hit a ship!");
    } else if (state === CellState.Miss) {
      setStatus("You missed!");
    } else {
      setStatus("You sunk a ship!");
    }
    if (timeoutId.current) {
      console.log("clearing timeout");
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      setStatus("");
    }, 1000);
  }

  return (
    <div className="container">
      <div className="restart-btn-wrapper">
        <button className="restart-btn">Restart Game</button>
      </div>
      <div className="boards-wrapper">
        <div className="opponent-board">
          <h1>Select a cell to attack:</h1>
          <div className="animation-msg">{status}</div>
          <Board
            board={opponentBoard}
            handleMouseEnter={function (id: string): void {}}
            handleMouseLeave={function (id: string): void {}}
            handleMouseClick={discoverCell}
          />
        </div>
        <div className="player-board">
          <h1>Your Board</h1>
          <div className="animation-msg">{status}</div>
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
