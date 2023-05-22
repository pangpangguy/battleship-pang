import { useState, useRef } from "react";
import { GameStartCellInfo, CellState } from "../common/types";
import Board from "./board";
import "./gamestart.css";
import { shipList } from "../common/constants";
import { cellHasShip } from "../common/utils";

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
  const [opponentShipsRemaining, setOpponentShipsRemaining] = useState(new Map<string, number>(initializeScoreMap()));
  const [discoverOutcomeMessage, setDiscoverOutcomeMessage] = useState<string>("");
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  function initializeScoreMap(): Map<string, number> {
    return shipList.reduce((map, ship) => map.set(ship.acronym, ship.size), new Map());
  }

  function getCellsToUpdate(
    targetCell: GameStartCellInfo,
    shipsRemaining: Map<string, number>,
    setShipsRemaining: (value: (prevState: Map<string, number>) => Map<string, number>) => void
  ): GameStartCellInfo[] {
    const cellsToUpdate: GameStartCellInfo[] = [];

    // If Sunk
    if (
      cellHasShip(targetCell) &&
      checkShipIsSunkAndUpdateShipsRemaining(targetCell.shipId, shipsRemaining, setShipsRemaining)
    ) {
      const cellsChangeToSunk = opponentBoard
        .flat()
        .filter((cell) => cellHasShip(cell) && cell.shipId === targetCell.shipId)
        .map((cell) => ({ ...cell, cellState: CellState.Sunk, isDiscovered: true }));
      cellsToUpdate.push(...cellsChangeToSunk);
    } else {
      // Hit or Miss
      cellsToUpdate.push({ ...targetCell, isDiscovered: true });
    }

    return cellsToUpdate;
  }

  function discoverPlayerCell(id: string) {
    const targetCell = opponentBoard.flat().find((cell) => cell.cellId === id && !cell.isDiscovered);

    //Skip already discovered cells
    if (!targetCell) {
      return;
    }

    const cellsToUpdate = getCellsToUpdate(targetCell, opponentShipsRemaining, setOpponentShipsRemaining);
    showDiscoverOutcomeMessage(cellsToUpdate[0].cellState);
    handleUpdateOpponentBoard(cellsToUpdate);
  }

  function discoverAICell(id: string) {
    //TODO: Implement AI
  }

  // Check if the ship that is hit will be sunk
  // If sunk, remove from map and return true; otherwise, update the ship parts remaining and return false
  function checkShipIsSunkAndUpdateShipsRemaining(
    shipId: string,
    shipsRemaining: Map<string, number>,
    setShipsRemaining: (value: (prevState: Map<string, number>) => Map<string, number>) => void
  ): boolean {
    const targetShipParts = shipsRemaining.get(shipId);

    //Shouldn't happen
    if (!targetShipParts) {
      throw new Error(`Unexpected error: ship with ID ${shipId} not found in map.`);
    }

    //Check if sunk and remove from map
    if (targetShipParts - 1 === 0) {
      setShipsRemaining((prev) => {
        const updatedMap = new Map(prev);
        updatedMap.delete(shipId);
        return updatedMap;
      });

      return true;
    }

    //Else update the map if is only Hit.
    setShipsRemaining((prev) => new Map(prev).set(shipId, targetShipParts - 1));
    return false;
  }

  function showDiscoverOutcomeMessage(state: CellState) {
    if (state === CellState.Hit) {
      setDiscoverOutcomeMessage("You hit a ship!");
    } else if (state === CellState.Miss) {
      setDiscoverOutcomeMessage("You missed!");
    } else {
      setDiscoverOutcomeMessage("You sunk a ship!");
    }
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      setDiscoverOutcomeMessage("");
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
          <div className="discover-outcome-msg">{discoverOutcomeMessage}</div>
          <Board
            board={opponentBoard}
            handleMouseEnter={function (id: string): void {}}
            handleMouseLeave={function (id: string): void {}}
            handleMouseClick={discoverPlayerCell}
          />
        </div>
        <div className="player-board">
          <h1>Your Board</h1>
          <div className="discover-outcome-msg"></div>
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
