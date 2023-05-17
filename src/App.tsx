import { ReactElement, useState } from "react";
import { CellInfo, GamePhase, GameStartCellInfo, PregameCellInfo } from "./common/types";
import Pregame from "./components/pregame";
import GameStart from "./components/gameStart";
import "./App.css";
import { generateBoard } from "./common/utils";

function App(): ReactElement {
  const [gameState, useGameState] = useState<GamePhase>(GamePhase.PreGame);
  const [playerBoard, setPlayerBoard] = useState<CellInfo[][]>(generateBoard());
  const [opponentBoard, setOpponentBoard] = useState<GameStartCellInfo[][]>(generateBoard());

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

  function renderCurrentGamePhase() {
    switch (gameState) {
      case GamePhase.PreGame:
        return (
          <Pregame
            handleStartGame={handleStartGame}
            playerBoard={playerBoard as PregameCellInfo[][]}
            handleUpdatePlayerBoard={handleUpdatePlayerBoard}
          />
        );
      case GamePhase.GameStart:
        return <GameStart />;
      case GamePhase.GameEnd:
        return <div>Game over!</div>;
      default:
        return <div>Invalid game phase!</div>;
    }
  }
  return <div className="App">{<GameStart />}</div>;
}

export default App;
