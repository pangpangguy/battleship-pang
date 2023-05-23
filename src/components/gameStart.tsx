import { useState, useRef } from "react";
import { GameStartCellInfo, CellState } from "../common/types";
import Board from "./board";
import "./gamestart.css";
import classNames from "classnames";
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
  const [gameState, setGameState] = useState<GameState>({ round: 1, isPlayerTurn: true });
  const [opponentShipsRemaining, setOpponentShipsRemaining] = useState(new Map<string, number>(initializeScoreMap()));
  const [discoverOutcomeMessage, setDiscoverOutcomeMessage] = useState<string>("");
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  type GameState = {
    round: number;
    isPlayerTurn: boolean;
  };

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
    if (!gameState.isPlayerTurn) {
      return;
    }

    const targetCell = opponentBoard.flat().find((cell) => cell.cellId === id && !cell.isDiscovered);

    //Skip already discovered cells
    if (!targetCell) {
      return;
    }

    const cellsToUpdate = getCellsToUpdate(targetCell, opponentShipsRemaining, setOpponentShipsRemaining);
    const newCellState = cellsToUpdate[0].cellState; //new state of cell(s)

    // Getting a hit or sunk will allow the player to continue selecting cells to attack.
    // Missing will end the player's turn and allow the AI to make a move.
    if (newCellState === CellState.Miss) {
      setGameState((prev) => ({ ...prev, isPlayerTurn: false }));
      simulateAIMove();
    }

    showDiscoverOutcomeMessage(newCellState);
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
    }, 1500);
  }

  function simulateAIMove() {
    setTimeout(() => {
      //AI makes a move..
      //TODO: Implement AI logic

      //After AI move, implement 2 to 3s delay to simulate game AI and update game state
      setGameState((prev) => ({ round: prev.round + 1, isPlayerTurn: true }));
    }, Math.random() * 1000 + 2000);
  }

  return (
    <div className="container">
      <div className="restart-btn-wrapper">
        <button className="restart-btn" onClick={handleRestartGame}>
          Restart Game
        </button>
      </div>
      <h2>
        Round {gameState.round} - {gameState.isPlayerTurn ? "Your turn!" : "AI's turn!"}
      </h2>
      <div className="boards-wrapper">
        <div
          className={classNames("opponent-board", {
            "player-turn": gameState.isPlayerTurn,
          })}
        >
          <h3>Select a cell to attack:</h3>
          <div className="discover-outcome-msg">{discoverOutcomeMessage}</div>
          <Board
            board={opponentBoard}
            handleMouseEnter={function (id: string): void {}}
            handleMouseLeave={function (id: string): void {}}
            handleMouseClick={discoverPlayerCell}
          />
        </div>
        <div className="player-board">
          <h3>Your Board</h3>
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
