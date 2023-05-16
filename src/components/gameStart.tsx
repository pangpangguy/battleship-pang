import { GameStartCellInfo, CellState, CellInfo, HoverState } from "../common/types";
import { useCallback, useRef, useState } from "react";
import { generateBoard } from "../common/utils";
import Board from "./board";
import "./gamestart.css";

export default function GameStart() {
  type GameStartCellStates = CellState.Hit | CellState.Miss | CellState.Sunk;

  //Randomly generates a board with ships with random states for testing purposes
  //To be removed later
  const randomStates: GameStartCellStates[] = [CellState.Miss, CellState.Hit, CellState.Sunk];
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
  const [status, setStatus] = useState<string>("");
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const discoverCell = useCallback(
    (id: string): void => {
      for (const cellRow of opponentBoard) {
        for (const cell of cellRow) {
          if (cell.cellId === id) {
            if (cell.discovered) {
              return; // Stop further processing if already discovered
            }

            //Play animation message
            showAnimationMessage(cell.cellState);

            //Uncover the cell
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
        }
      }
    },
    [opponentBoard, timeoutId]
  );

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
