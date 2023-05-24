import "./mainpage.css";

interface MainPageProps {
  handleEnterPregame: () => void;
  handleNameInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  playerName: string;
}

export default function MainPage({ handleEnterPregame, handleNameInputChange, playerName }: MainPageProps) {
  return (
    <div className="mainpage-container">
      <h1 className="title">Super Cool Battleship Game</h1>
      <input type="text" className="name-input" placeholder="Enter Your Name" onChange={handleNameInputChange} />
      <button onClick={handleEnterPregame} className="start-btn" disabled={playerName.length <= 0}>
        Start Game
      </button>
    </div>
  );
}
