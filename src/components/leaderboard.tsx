import { useEffect, useRef, useState } from "react";
import { getScoreboardData } from "../common/utils";
import { ScoreData } from "../common/types";
import { Player } from "@lottiefiles/react-lottie-player";
import loadingAnimation from "../assets/loading.json";
import { MdSignalWifiOff } from "react-icons/md";
import "./leaderboard.css";

interface LeaderboardProps {
  handleReturnMainPage: () => void;
}

export default function MainPage({ handleReturnMainPage }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<ScoreData[]>(Array(10));
  const [loading, setLoading] = useState(true);
  const [timeoutError, setTimeoutError] = useState<boolean>(false); //Display a timeout error when it takes too long
  const loadingTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  function getPlacementIndex(place: number) {
    if (place === 1) return "1st";
    else if (place === 2) return "2nd";
    else if (place === 3) return "3rd";
    else return place + "th";
  }

  function getMedalClass(rank: number) {
    switch (rank) {
      case 1:
        return "gold";
      case 2:
        return "silver";
      case 3:
        return "bronze";
      default:
        return "";
    }
  }

  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        //Fetch existing scoreboard
        const data = await getScoreboardData();

        loadingTimeoutId.current && clearTimeout(loadingTimeoutId.current);
        setLeaderboard((prev) => {
          const leaderboard = [...prev];
          for (let i = 0; i < data.length; i++) {
            leaderboard[i] = data[i];
          }
          leaderboard.sort((a, b) => a.score - b.score);
          setLoading(false);
          return leaderboard;
        });
      } catch (error) {
        console.error("Leaderboard : Unexpected error occurred while fetching scoreboard: ", error);
      }
    };

    loadingTimeoutId.current = setTimeout(() => {
      setLoading(false);
      setTimeoutError(true);
    }, 10000);

    getLeaderboard();

    //Cleanup
    //In development mode, React renders components twice, creating 2 different timeout Ids (ref: https://react.dev/learn/synchronizing-with-effects)
    //This code below is to clear the timeoutId from the first render.
    return () => {
      if (loadingTimeoutId.current) {
        clearTimeout(loadingTimeoutId.current);
      }
    };
  }, []);

  return (
    <div className="leaderboard">
      {timeoutError ? (
        <div className="error-message">
          <MdSignalWifiOff size={48} />
          <h3>Fail to load the leaderboard.</h3>
          <h3>Bad connection or potato PC.</h3>
          <button className="return-btn" onClick={handleReturnMainPage}>
            Return
          </button>
        </div>
      ) : loading ? (
        <Player
          src={loadingAnimation}
          className="loading-animation"
          loop
          autoplay
          style={{ width: "50rem", height: "20rem" }}
        />
      ) : (
        <>
      <h1 className="animate__animated animate__fadeIn">Leaderboard</h1>
      <h2 className="description  animate__animated animate__fadeIn">
        Based on the number of rounds required to beat the AI
      </h2>
      {leaderboard.map((entry, index) => {
        return (
          <div
            className={`board-entry ${getMedalClass(index + 1)} animate__animated animate__fadeInUp`}
            style={{ animationDelay: `${index * 0.08}s` }}
            key={index}
          >
            <p>{getPlacementIndex(index + 1)}</p>
            <p>{entry ? entry.name : "---"}</p>
            <p>{entry ? entry.score : "---"}</p>
          </div>
        );
      })}
      <button
        className="return-btn  animate__animated animate__fadeInUp animate__delay-1s"
        onClick={handleReturnMainPage}
      >
        Return
      </button>
        </>
      )}
    </div>
  );
}
