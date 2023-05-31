import { useEffect, useRef, useState } from "react";
import { getScoreboardData } from "../common/utils";
import { ScoreData } from "../common/types";

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
    }, 3000);

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
      {loading && (
        <Player
          src="https://assets8.lottiefiles.com/packages/lf20_b88nh30c.json"
          className="loading-animation"
          loop
          autoplay
        />
      )}
      <h1>Leaderboard</h1>
      <h2 className="description">Based on the number of rounds required to beat the AI</h2>
      {leaderboard.map((entry, index) => {
        return (
          <div className={`board-entry ${getMedalClass(index + 1)}`} key={index}>
            <p>{getPlacementIndex(index + 1)}</p>
            <p>{entry ? entry.name : "---"}</p>
            <p>{entry ? entry.score : "---"}</p>
          </div>
        );
      })}
      <button className="return-btn" onClick={handleReturnMainPage}>
        Return
      </button>
    </div>
  );
}
