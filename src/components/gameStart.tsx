import { useState, useRef, useEffect } from "react";
import { GameStartCellInfo, CellState } from "../common/types";
import Board from "./board";
import "./gamestart.css";
import { shipList } from "../common/constants";
import classNames from "classnames";
import { cellHasShip } from "../common/utils";
import { useBattleshipAI } from "../common/ai";

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
  const [playerShipsRemaining, setPlayerShipsRemaining] = useState(new Map<string, number>(initializeScoreMap()));
  const [playerDiscoverOutcomeMessage, setPlayerDiscoverOutcomeMessage] = useState<string>("");
  const [opponentDiscoverOutcomeMessage, setOpponentDiscoverOutcomeMessage] = useState<string>("");
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { aiHitList, addCellToHitList, getAICellToAttack } = useBattleshipAI(playerBoard);

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
    showDiscoverOutcomeMessage(newCellState, true, setPlayerDiscoverOutcomeMessage);
    handleUpdateOpponentBoard(cellsToUpdate);
    if (newCellState === CellState.Miss) {
      setGameState((prev) => ({ round: prev.round + 1, isPlayerTurn: false }));
      AIMove();
    }
  }

  function AIMove() {
    setTimeout(() => {
      const undiscoveredCells = playerBoard.flat().filter((cell) => !cell.isDiscovered);

      // Game over not yet implemented
      if (!undiscoveredCells.length) {
        return;
      }

      //Get cell to attack
      const cellToAttack: GameStartCellInfo = getAICellToAttack();

      // Update the cell state to discovered, just as the player does
      const cellsToUpdate = getCellsToUpdate(cellToAttack, playerShipsRemaining, setPlayerShipsRemaining);
      const newCellState = cellsToUpdate[0].cellState; //new state of cell(s)

      showDiscoverOutcomeMessage(newCellState, false, setOpponentDiscoverOutcomeMessage);
      handleUpdatePlayerBoard(cellsToUpdate);

      if (newCellState === CellState.Miss) {
        setGameState((prev) => ({ round: prev.round + 1, isPlayerTurn: true }));
      } else {
        // If the AI gets a hit, add the cell to the hit list
        addCellToHitList(cellToAttack);
        //Make another move
        AIMove();
      }
    }, Math.random() * 1000 + 2000);
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

  function showDiscoverOutcomeMessage(
    state: CellState,
    isPlayerTurn: boolean,
    setDiscoverOutcomeMessage: React.Dispatch<React.SetStateAction<string>>
  ) {
    const currentAttacker = isPlayerTurn ? "You" : "AI";
    switch (state) {
      case CellState.Hit:
        setDiscoverOutcomeMessage(`${currentAttacker} hit a ship! ${currentAttacker} can attack again!`);
        break;
      case CellState.Miss:
        setDiscoverOutcomeMessage(`${currentAttacker} missed!`);
        break;
      case CellState.Sunk:
        setDiscoverOutcomeMessage(`${currentAttacker} sunk a ship! ${currentAttacker} can attack again!`);
        break;
    }

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      setDiscoverOutcomeMessage("");
    }, 1500);
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
          <div className="discover-outcome-msg">{playerDiscoverOutcomeMessage}</div>
          <Board
            board={opponentBoard}
            handleMouseEnter={function (id: string): void {}}
            handleMouseLeave={function (id: string): void {}}
            handleMouseClick={discoverPlayerCell}
          />
        </div>
        <div className="player-board">
          <h3>Your Board</h3>
          <div className="discover-outcome-msg">{opponentDiscoverOutcomeMessage}</div>
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
