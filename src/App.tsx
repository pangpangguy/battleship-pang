import { ReactElement } from "react";
import "./App.css";
import Pregame from "./components/pregame";

function App(): ReactElement {
  return (
    <div className="App">
      <h2>Place your ships on the board:</h2>
      <Pregame />
      <div>
        <p>Example placeholder text</p>
      </div>
    </div>
  );
}

export default App;
