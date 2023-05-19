import { ReactElement, useState } from "react";
import {
  CellInfo,
  CellState,
  GamePhase,
  GameStartCellInfo,
  PregameCellInfo,
  GameStartCellInfoWithShip,
  GameStartCellInfoWithoutShip,
} from "./common/types";
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
        const randomState: GameStartCellStates = randomStates[Math.floor(Math.random() * randomStates.length)];
        if (randomState === CellState.Miss) {
          const newCell: GameStartCellInfoWithoutShip = {
            ...cell,
            isDiscovered: false,
            cellState: randomState,
          };
          return newCell;
        } else {
          const newCell: GameStartCellInfoWithShip = {
            ...cell,
            isDiscovered: false,
            cellState: randomState,
            shipId: "temp",
          };
          return newCell;
        }
      });
    });
  };
  const [gameState, setGameState] = useState<GamePhase>(GamePhase.PreGame);
  const [playerBoard, setPlayerBoard] = useState<CellInfo[][]>(generateBoard());
  const [opponentBoard, setOpponentBoard] = useState<GameStartCellInfo[][]>(generateRandomBoard());

  function handleStartGame() {
    setGameState(GamePhase.GameStart);
  }

  function handleRestartGame() {
    setPlayerBoard(generateBoard());
    setGameState(GamePhase.PreGame);
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
            handleRestartGame={handleRestartGame}
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
