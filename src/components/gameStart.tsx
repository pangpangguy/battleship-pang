import { useState, useRef, useEffect } from "react";
import { GameStartCellInfo, CellState } from "../common/types";
import Board from "./board";
import "./gamestart.css";
import { shipList } from "../common/constants";
import classNames from "classnames";
import { cellHasShip } from "../common/utils";
import aiAnimation from "../assets/thinking.json";
import { Player } from "@lottiefiles/react-lottie-player";

interface GameStartProps {
  playerBoard: GameStartCellInfo[][];
  opponentBoard: GameStartCellInfo[][];
  handleUpdateOpponentBoard: (cellsToUpdate: GameStartCellInfo[]) => void;
  handleUpdatePlayerBoard: (cellsToUpdate: GameStartCellInfo[]) => void;
  handleRestartGame: () => void;
  handleGameEnd: (score: number) => void;
  handleEnterLeaderboard: () => void;
}

export default function GameStart({
  playerBoard,
  opponentBoard,
  handleUpdateOpponentBoard,
  handleUpdatePlayerBoard,
  handleRestartGame,
  handleGameEnd,
  handleEnterLeaderboard,
}: GameStartProps) {
  const [gameState, setGameState] = useState<GameState>({ round: 1, isPlayerTurn: true });
  const [opponentShipsRemaining, setOpponentShipsRemaining] = useState(new Map<string, number>(initializeScoreMap()));
  const [playerShipsRemaining, setPlayerShipsRemaining] = useState(new Map<string, number>(initializeScoreMap()));
  const [playerMessage, setPlayerMessage] = useState<string>("Select a cell to attack");
  const [opponentMessage, setOpponentMessage] = useState<string>("AI");
  const playerTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const opponentTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiMoveTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const gameEnd = !opponentShipsRemaining.size || !playerShipsRemaining.size;

  type GameState = {
    round: number;
    isPlayerTurn: boolean;
  };

  function initializeScoreMap(): Map<string, number> {
    return shipList.reduce((map, ship) => map.set(ship.acronym, ship.size), new Map());
  }

  function getCellsToUpdate(
    board: GameStartCellInfo[][],
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
      const cellsChangeToSunk = board
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

    const cellsToUpdate = getCellsToUpdate(
      opponentBoard,
      targetCell,
      opponentShipsRemaining,
      setOpponentShipsRemaining
    );
    const newCellState = cellsToUpdate[0].cellState; //new state of cell(s)

    // Getting a hit or sunk will allow the player to continue selecting cells to attack.
    // Missing will end the player's turn and allow the AI to make a move.
    showDiscoverOutcomeMessage(newCellState, true, setPlayerMessage);
    handleUpdateOpponentBoard(cellsToUpdate);
    if (newCellState === CellState.Miss) {
      setGameState((prev) => ({ ...prev, isPlayerTurn: false }));
      setTimeout(() => setOpponentMessage("AI is thinking"), 500);
      AIMove();
    }
  }

  function AIMove() {
    aiMoveTimeoutId.current = setTimeout(() => {
      if (gameEnd) {
        return;
      }
      const undiscoveredCells = playerBoard.flat().filter((cell) => !cell.isDiscovered);
      //Get cell to attack
      const cellToAttack: GameStartCellInfo = undiscoveredCells[Math.floor(Math.random() * undiscoveredCells.length)];

      // Update the cell state to discovered, just as the player does
      const cellsToUpdate = getCellsToUpdate(playerBoard, cellToAttack, playerShipsRemaining, setPlayerShipsRemaining);
      const newCellState = cellsToUpdate[0].cellState; //new state of cell(s)

      showDiscoverOutcomeMessage(newCellState, false, setOpponentMessage);
      handleUpdatePlayerBoard(cellsToUpdate);

      if (newCellState === CellState.Miss) {
        setGameState((prev) => ({ round: prev.round + 1, isPlayerTurn: true }));
        setTimeout(() => setPlayerMessage("Select a cell to attack"), 500);
      } else {
        //Make another move
        AIMove();
      }
    }, Math.random() * 1000 + 3000);
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
  }

  const showAIThinkingAnimation: boolean =
    opponentMessage === "AI is thinking" ||
    opponentMessage === "AI hit a ship! AI can attack again!" ||
    opponentMessage === "AI sunk a ship! AI can attack again!";

  useEffect(() => {
    if (gameEnd && gameState.isPlayerTurn) {
      handleGameEnd(gameState.round);
    }
  }, [gameEnd]);

  return (
    <div className="container animate__animated animate__fadeIn">
      {gameEnd && (
        <div className="game-over-overlay">
          <h2>Game Over : {gameState.isPlayerTurn ? "You Win!" : "AI Win!"}</h2>
          {gameState.isPlayerTurn && <h3>You defeated the AI in {gameState.round} rounds!</h3>}
          <button onClick={handleRestartGame}>Restart Game</button>
          <button style={{ marginTop: "1rem" }} onClick={handleEnterLeaderboard}>
            Go to leaderboard
          </button>
        </div>
      )}
      <div className="restart-btn-wrapper">
        <button
          onClick={() => {
            aiMoveTimeoutId.current && clearTimeout(aiMoveTimeoutId.current);
            handleRestartGame();
          }}
        >
          Restart Game
        </button>
      </div>
      <div className="animate__animated animate__fadeIn" key={gameState.round}>
        <h1>
          Round {gameState.round} -&nbsp;
          <span
            className="animate__animated animate__fadeIn"
            key={`${gameState.round}-${gameState.isPlayerTurn ? "player" : "ai"}`}
          >
            {gameState.isPlayerTurn ? "Your turn!" : "AI's turn!"}
          </span>
        </h1>
      </div>
      <div className="boards-wrapper">
        <div
          className={classNames("opponent-board", {
            "player-turn": gameState.isPlayerTurn,
          })}
        >
          <div className="message animate__animated animate__fadeInDown" key={playerMessage}>
            {playerMessage}
          </div>

          <Board
            board={opponentBoard}
            handleMouseEnter={function (): void {}}
            handleMouseLeave={function (): void {}}
            handleMouseClick={discoverPlayerCell}
          />
        </div>
        <div
          className={classNames("player-board", {
            "player-turn": gameState.isPlayerTurn,
          })}
        >
          <div className="message animate__animated animate__fadeInDown" key={opponentMessage}>
            {opponentMessage}
            {showAIThinkingAnimation && <Player src={aiAnimation} className="ai-animation" loop autoplay />}
          </div>

          <Board
            board={playerBoard}
            handleMouseEnter={function (): void {}}
            handleMouseLeave={function (): void {}}
            handleMouseClick={function (): void {}}
          />
        </div>
      </div>
    </div>
  );
}
