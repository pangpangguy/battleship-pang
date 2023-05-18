import { useState, useRef } from "react";
import { CellInfo, GameStartCellInfo, CellState } from "../common/types";
import Board from "./board";
import "./gamestart.css";
import { shipList } from "../common/constants";
interface GameStartProps {
  playerBoard: GameStartCellInfo[][];
  opponentBoard: GameStartCellInfo[][];
  handleUpdateOpponentBoard: (cellsToUpdate: GameStartCellInfo[]) => void;
  handleUpdatePlayerBoard: (cellsToUpdate: GameStartCellInfo[]) => void;
  handleRestartGame: () => void;
}

export default function GameStart({
  playerBoard,
  opponentBoard,
  handleUpdateOpponentBoard,
  handleUpdatePlayerBoard,
  handleRestartGame,
}: GameStartProps) {
  const [playerShipsRemaining, setPlayerShipsRemaining] = useState<Map<string, number>>(
    new Map<string, number>(initializeScoreMap())
  );
  const [status, setStatus] = useState<string>("");
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  function initializeScoreMap(): Map<string, number> {
    return shipList.reduce((map, ship) => map.set(ship.acronym, ship.size), new Map());
  }
  function discoverCell(id: string): void {
    const targetCell = opponentBoard.flat().find((cell) => cell.cellId === id && !cell.discovered);

    //Skip already discovered cells
    if (!targetCell) {
      return;
    }

    const cellsToUpdate: GameStartCellInfo[] = [];

    if ("shipId" in targetCell && checkShipIsSunkAndUpdateShipsRemaining(targetCell)) {
      const cellsChangeToSunk = opponentBoard
        .flat()
        .filter((cell) => "shipId" in cell && cell.shipId === targetCell.shipId)
        .map((cell) => ({ ...cell, cellState: CellState.Sunk, discovered: true }));
      cellsToUpdate.push(...cellsChangeToSunk);
    } else {
      cellsToUpdate.push({ ...targetCell, discovered: true });
    }

    showAnimationMessage(cellsToUpdate[0].cellState);
    handleUpdateOpponentBoard(cellsToUpdate);
  }

  // Check if the discovered cell sunks the last part of ship and updates the ships remaining map
  function checkShipIsSunkAndUpdateShipsRemaining(cell: GameStartCellInfo): boolean {
    //Miss
    if (!cell.shipId) return false;

    const cellShipId = cell.shipId;
    const targetShipParts = playerShipsRemaining.get(cellShipId);

    //Shouldn't happen
    if (!targetShipParts) {
      throw new Error(`Unexpected error: ship with ID ${cell.shipId} not found in map.`);
    }

    //Hit
    if (targetShipParts - 1 > 0) {
      setPlayerShipsRemaining((prev) => new Map(prev).set(cellShipId, targetShipParts - 1));
      return false;
    }

    //Sunk : Remove from map
    setPlayerShipsRemaining((prev) => {
      const updatedMap = new Map(prev);
      updatedMap.delete(cellShipId);
      return updatedMap;
    });
    return true;
  }

  function showAnimationMessage(state: CellState) {
    if (state === CellState.Hit) {
      setStatus("You hit a ship!");
    } else if (state === CellState.Miss) {
      setStatus("You missed!");
    } else {
      setStatus("You sunk a ship!");
    }
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      setStatus("");
    }, 1000);
  }

  return (
    <div className="container">
      <div className="restart-btn-wrapper">
        <button className="restart-btn" onClick={handleRestartGame}>
          Restart Game
        </button>
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
          <div className="animation-msg"></div>
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
