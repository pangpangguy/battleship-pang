import { ReactElement, useEffect, useState } from "react";
import { CellInfo, CellState, GamePhase, GameStartCellInfo, HoverState, PregameCellInfo } from "./common/types";
import Pregame from "./components/pregame";
import GameStart from "./components/gameStart";
import "./App.css";
import { generateBoard } from "./common/utils";

function App(): ReactElement {
  //Randomly generates a board with ships with random states for testing purposes
  //To be removed later
  type GameStartCellStates = CellState.Hit | CellState.Miss | CellState.Sunk;
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
  const [gameState, useGameState] = useState<GamePhase>(GamePhase.PreGame);
  const [playerBoard, setPlayerBoard] = useState<CellInfo[][]>(generateBoard());
  const [opponentBoard, setOpponentBoard] = useState<GameStartCellInfo[][]>(generateRandomBoard());

  function handleStartGame() {
    useGameState(GamePhase.GameStart);
  }

  //Accepst a list of new target cells to be updated/replaced on the board
  function handleUpdatePlayerBoard(cellsToUpdate: PregameCellInfo[]) {
    //Update the new board with cells in targetCells
    setPlayerBoard((currentBoard) =>
      currentBoard.map((rowCells) => {
        return rowCells.map((cell) => {
          const newCell = cellsToUpdate.find((newCell) => newCell.cellId === cell.cellId);
          if (newCell) {
            return { ...newCell };
          } else return { ...cell };
        });
      })
    );
  }

  function handleUpdateOpponentBoard(cellsToUpdate: GameStartCellInfo[]) {
    //Update the new board with cells in targetCells
    setOpponentBoard((currentBoard) =>
      currentBoard.map((rowCells) => {
        return rowCells.map((cell) => {
          const newCell = cellsToUpdate.find((newCell) => newCell.cellId === cell.cellId);
          if (newCell) {
            return { ...newCell };
          } else return { ...cell };
        });
      })
    );
  }

  function renderCurrentGamePhase() {
    switch (gameState) {
      case GamePhase.PreGame:
        return (
          <Pregame
            playerBoard={playerBoard as PregameCellInfo[][]}
            handleStartGame={handleStartGame}
            handleUpdatePlayerBoard={handleUpdatePlayerBoard}
          />
        );
      case GamePhase.GameStart:
        return (
          <GameStart
            opponentBoard={opponentBoard}
            playerBoard={playerBoard}
            handleUpdateOpponentBoard={handleUpdateOpponentBoard}
          />
        );
      case GamePhase.GameEnd:
        return <div>Game over!</div>;
      default:
        return <div>Invalid game phase!</div>;
    }
  }

  return <div className="App">{renderCurrentGamePhase()}</div>;

}

export default App;
