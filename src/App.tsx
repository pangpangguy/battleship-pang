import { ReactElement } from "react";
import "./App.css";
import GameStart from "./components/gameStart";

function App(): ReactElement {
  return (
    <div className="App">
      <GameStart />
    </div>
  );
}

export default App;
