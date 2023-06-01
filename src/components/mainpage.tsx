import classNames from "classnames";
import "./mainpage.css";

interface MainPageProps {
  handleEnterPregame: () => void;
  handleNameInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEnterLeaderboard: () => void;
  playerName: string;
}

export default function MainPage({
  handleEnterPregame,
  handleNameInputChange,
  handleEnterLeaderboard,
  playerName,
}: MainPageProps) {
  return (
    <div className="mainpage-container animate__animated animate__fadeIn">
      <h1 className="title">Super Cool Battleship Game</h1>
      <input
        type="text"
        maxLength={11}
        className={classNames("name-input", {
          "input-error": playerName.length > 10,
        })}
        placeholder="Enter Your Name"
        onChange={handleNameInputChange}
      />
      <h2></h2>
      <h2
        className="input-error-message"
        style={{ visibility: playerName.length > 10 ? "visible" : "hidden" }}
        key={playerName}
      >
        Please enter no more than 10 characters.
      </h2>
      <button
        onClick={handleEnterPregame}
        className="main-page-btn"
        disabled={!playerName.length || playerName.length > 10}
      >
        Start Game
      </button>

      <button onClick={handleEnterLeaderboard} className="main-page-btn">
        Leaderboard
      </button>
    </div>
  );
}
