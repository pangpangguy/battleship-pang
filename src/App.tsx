import { ReactElement, useState } from "react";
import { GamePhase } from "./common/types";
import Pregame from "./components/pregame";
import GameStart from "./components/gameStart";
import "./App.css";

function App(): ReactElement {
  const [gameState, useGameState] = useState<GamePhase>(GamePhase.PreGame);

  function handleStartGame() {
    useGameState(GamePhase.GameStart);
  }

  function handleRestartGame() {
    useGameState(GamePhase.PreGame);
  }

  function renderCurrentGamePhase() {
    switch (gameState) {
      case GamePhase.PreGame:
        return <Pregame handleStartGame={handleStartGame} />;
      case GamePhase.GameStart:
        return <GameStart handleRestartGame={handleRestartGame} />;
      case GamePhase.GameEnd:
        return <div>Game over!</div>;
      default:
        return <div>Invalid game phase!</div>;
    }
  }
  return <div className="App">{renderCurrentGamePhase()}</div>;
}

export default App;
