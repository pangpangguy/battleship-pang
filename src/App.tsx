import { ReactElement } from "react";
import "./App.css";
import Board from "./components/board";
import ShipPlacement from "./components/ship-placement";

function App(): ReactElement {
  return (
    <div className="App">
      <h2>Place your ships on the board:</h2>
      <Board />
      <ShipPlacement />
      <div>
        <p>Example placeholder text</p>
      </div>
    </div>
  );
}

export default App;
