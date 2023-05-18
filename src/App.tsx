import { ReactElement, useState } from "react";
import { GamePhase, GameStartCellInfo, PregameCellInfo } from "./common/types";
import Pregame from "./components/pregame";
import GameStart from "./components/gameStart";
import "./App.css";
import { generateGameStartBoardWithShips, generatePregameBoard } from "./common/utils";

function App(): ReactElement {
  const [gameState, useGameState] = useState<GamePhase>(GamePhase.PreGame);
  const [playerBoard, setPlayerBoard] = useState<PregameCellInfo[][]>(generatePregameBoard());
  const [opponentBoard, setOpponentBoard] = useState<GameStartCellInfo[][]>(generateGameStartBoardWithShips());

  function handleStartGame() {
    useGameState(GamePhase.GameStart);
  }

  function handleRestartGame() {
    useGameState(GamePhase.PreGame);
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
  return (
    <div className="App">
      {
        <GameStart
          opponentBoard={opponentBoard}
          playerBoard={playerBoard}
          handleUpdateOpponentBoard={handleUpdateOpponentBoard}
          handleRestartGame={handleRestartGame}
        />
      }
    </div>
  );
}

export default App;
