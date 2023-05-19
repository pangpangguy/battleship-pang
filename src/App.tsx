import { ReactElement, useState } from "react";
import { CellInfo, CellState, GamePhase, GameStartCellInfo, GameState, PregameCellInfo } from "./common/types";
import Pregame from "./components/pregame";
import GameStart from "./components/gameStart";
import "./App.css";
import { generateOpponentBoardWithShips, generatePregameBoard } from "./common/utils";

function App(): ReactElement {
  const [gameState, setGameState] = useState<GameState>(getInitialGameState());

  //Get initial game state (pregame ship placement page)
  function getInitialGameState(): GameState {
    return {
      gamePhase: GamePhase.PreGame,
      playerBoard: generatePregameBoard(),
      opponentBoard: undefined,
    };
  }

  function handleStartGame() {
    setGameState((currentState) => ({
      gamePhase: GamePhase.GameStart,
      playerBoard: convertBoardToGameStart(currentState.playerBoard as PregameCellInfo[][]),
      opponentBoard: generateOpponentBoardWithShips(),
    }));
  }

  function handleRestartGame() {
    setGameState(getInitialGameState());
  }

  //Convert player's board from pregame to gameStart
  function convertBoardToGameStart(pregamePlayerBoard: PregameCellInfo[][]): GameStartCellInfo[][] {
    return pregamePlayerBoard.map((cellRow) => {
      return cellRow.map((cell) => {
        //remove hoverState and add cellState
        const { hoverState, ...otherProperties } = cell;
        return {
          ...otherProperties,
          cellState: cell.shipId ? CellState.Hit : CellState.Miss,
          discovered: false,
        };
      });
    });
  }

  function handleUpdatePlayerPregameBoard(cellsToUpdate: PregameCellInfo[]) {
    setGameState((currentState) => ({
      ...currentState,
      playerBoard: updateBoard(currentState.playerBoard as PregameCellInfo[][], cellsToUpdate),
    }));
  }

  // Player board update handler for pregame
  function handleUpdatePlayerGameStartBoard(cellsToUpdate: GameStartCellInfo[]) {
    setGameState((currentState) => ({
      ...currentState,
      playerBoard: updateBoard(currentState.playerBoard as GameStartCellInfo[][], cellsToUpdate),
    }));
  }

  // Player board update handler for gameStart
  function handleUpdateOpponentBoard(cellsToUpdate: GameStartCellInfo[]) {
    setGameState((currentState) => ({
      ...currentState,
      opponentBoard: updateBoard(currentState.opponentBoard as GameStartCellInfo[][], cellsToUpdate),
    }));
  }

  //Accepst a list of new target cells to be updated/replaced on the board
  //Update the new board with cells in targetCells
  function updateBoard<T extends CellInfo>(currentBoard: T[][], cellsToReplace: T[]): T[][] {
    return currentBoard.map((rowCells) => {
      return rowCells.map((cell) => {
        const newCell = cellsToReplace.find((newCell) => newCell.cellId === cell.cellId);
        if (newCell) {
          return { ...newCell };
        } else return { ...cell };
      });
    });
  }

  function renderCurrentGamePhase() {
    switch (gameState.gamePhase) {
      case GamePhase.PreGame:
        return (
          <Pregame
            playerBoard={gameState.playerBoard as PregameCellInfo[][]}
            handleStartGame={handleStartGame}
            handleUpdatePlayerBoard={handleUpdatePlayerPregameBoard}
          />
        );
      case GamePhase.GameStart:
        return (
          <GameStart
            opponentBoard={gameState.opponentBoard as GameStartCellInfo[][]}
            playerBoard={gameState.playerBoard as GameStartCellInfo[][]}
            handleUpdateOpponentBoard={handleUpdateOpponentBoard}
            handleUpdatePlayerBoard={handleUpdatePlayerGameStartBoard}
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
