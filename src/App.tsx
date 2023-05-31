import { ReactElement, useEffect, useState } from "react";
import {
  CellInfo,
  CellState,
  GamePhase,
  GameStartCellInfo,
  GameState,
  PregameCellInfo,
  ScoreData,
} from "./common/types";
import {
  generateOpponentBoardWithShips,
  generatePregameBoard,
  getScoreboardData,
  postNewScoreboard,
} from "./common/utils";
import Pregame from "./components/pregame";
import GameStart from "./components/gameStart";
import MainPage from "./components/mainpage";
import "./App.css";
import Leaderboard from "./components/leaderboard";

function App(): ReactElement {
  const [gameState, setGameState] = useState<GameState>(getInitialGameState());
  const [playerName, setPlayerName] = useState<string>("");
  const [windowSize, setWindowSize] = useState<number>(window.innerWidth);

  //Get initial game state
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

  function handleEnterLeaderboard() {
    setGameState(() => ({
      gamePhase: GamePhase.Leaderboard,
    }));
  }

  function handleRestartGame() {
    setPlayerName("");
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
    try {
      //Fetch existing scoreboard
      const scoreboard = await getScoreboardData();

      // Check if scoreboard already has 10 entries
      if (scoreboard.length >= 10) {
        // Find the maximum score in the scoreboard
        const maxScore = Math.max(...scoreboard.map((entry) => entry.score));

        // Only add the new score if it is less than the maximum score
        if (score < maxScore) {
          // Remove the entry with the maximum score
          const index = scoreboard.findIndex((entry) => entry.score === maxScore);
          scoreboard.splice(index, 1);

          // Add the new score
          scoreboard.push({ name: playerName, score: score });

          // Send update request to server
          await postNewScoreboard(scoreboard);
        }
      } else {
        // If scoreboard has less than 10 entries, simply add the new score
        const newScoreboard: ScoreData[] = scoreboard.concat({ name: playerName, score: score });

        // Send update request to server
        await postNewScoreboard(newScoreboard);
      }
    } catch (error) {
      console.error("Unexpected error occurred while handling Game End: ", error);
    }
  }

  // Show the overlay message if the user is in mobile mode, or the screen size (width) is <600px
  function disableGame(): boolean {
    const isMobileDevice = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    return isMobileDevice() || windowSize <= 600;
  }

  useEffect(() => {
    setPlayerName("");

    //To handle when user resizes the window/ changes to mobile
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    // Register the window resize listener
    window.addEventListener("resize", handleResize);

    // Unregister the listener on cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures this effect runs once on mount and cleans up on unmount

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
            handleEnterLeaderboard={handleEnterLeaderboard}
          />
        );
      case GamePhase.MainPage:
        return (
          <MainPage
            handleEnterPregame={handleEnterPregame}
            handleNameInputChange={handleNameInputChange}
            handleEnterLeaderboard={handleEnterLeaderboard}
            playerName={playerName}
          />
        );
      case GamePhase.Leaderboard:
        return (
          <Leaderboard
            handleReturnMainPage={() => {
              setGameState(() => ({
                gamePhase: GamePhase.MainPage,
              }));
            }}
          />
        );
      default:
        return <div>Invalid game phase!</div>;
    }
  }

  return (
    <div className="App">
      {disableGame() && (
        <div className="disabled-game-overlay">
          This game is not optimized for mobile or smaller screen sizes, change device or to a bigger screen size plz
        </div>
      )}
      {renderCurrentGamePhase()}
    </div>
  );
}
export default App;
