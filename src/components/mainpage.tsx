import "./mainpage.css";

interface MainPageProps {
  handleEnterPregame: () => void;
}

export default function MainPage({ handleEnterPregame }: MainPageProps) {
  return (
    <div className="mainpage-container">
      <h1 className="title">Cool Battleship Game</h1>
      <button onClick={handleEnterPregame} className="start-btn">
        Start Game
      </button>
    </div>
  );
}
