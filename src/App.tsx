import { ReactElement, useState } from "react";
import { CellInfo, CellState, GamePhase, GameStartCellInfo, GameState, PregameCellInfo } from "./common/types";
import { generateOpponentBoardWithShips, generatePregameBoard } from "./common/utils";
import Pregame from "./components/pregame";
import GameStart from "./components/gameStart";
import MainPage from "./components/mainpage";
import "./App.css";
import { api, apiId } from "./common/constants";

function App(): ReactElement {
  const [gameState, setGameState] = useState<GameState>(getInitialGameState());
  const [playerName, setPlayerName] = useState<string>("");

  //Get initial game state (pregame ship placement page)
  function getInitialGameState(): GameState {
    return {
      gamePhase: GamePhase.MainPage,
    };
  }

  function handleNameInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPlayerName(event.target.value);
  }

  function handleEnterPregame() {
    setGameState(() => ({
      gamePhase: GamePhase.PreGame,
      playerBoard: generatePregameBoard(),
    }));
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
          isDiscovered: false,
        };
      });
    });
  }

  // Player board update handler for pregame
  function handleUpdatePlayerPregameBoard(cellsToUpdate: PregameCellInfo[]) {
    setGameState((currentState) => ({
      ...currentState,
      playerBoard: updateBoard(currentState.playerBoard as PregameCellInfo[][], cellsToUpdate),
    }));
  }

  // Player board update handler for gameStart
  function handleUpdatePlayerGameStartBoard(cellsToUpdate: GameStartCellInfo[]) {
    setGameState((currentState) => ({
      ...currentState,
      playerBoard: updateBoard(currentState.playerBoard as GameStartCellInfo[][], cellsToUpdate),
    }));
  }

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

  async function handleGameEnd(score: number) {
    //Fetch existing data
    const data = await fetch(api.concat(`?id=${apiId}`))
      .then((response) => {
        if (!response.ok) {
          throw new Error("Response not ok");
        }
        return response.json();
      })
      .then((response) => {
        return response.data;
      });

    //Update the data
    const dataToSend = { id: apiId, data: data.concat({ name: playerName, score: score }) };

    //Send POST request
    try {
      const response = await fetch(api, {
        method: "POST",
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      throw new Error("Unexpected error occured: " + error);
    }
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
            handleGameEnd={handleGameEnd}
          />
        );
      case GamePhase.MainPage:
        return (
          <MainPage
            handleEnterPregame={handleEnterPregame}
            handleNameInputChange={handleNameInputChange}
            playerName={playerName}
          />
        );
      default:
        return <div>Invalid game phase!</div>;
    }
  }

  return <div className="App">{renderCurrentGamePhase()}</div>;
}
export default App;
