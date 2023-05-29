import { useEffect, useState } from "react";
import { getScoreboardData } from "../common/utils";
import { ScoreData } from "../common/types";

import "./leaderboard.css";
interface LeaderboardProps {
  handleReturnMainPage: () => void;
}

export default function MainPage({ handleReturnMainPage }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<ScoreData[]>(Array(10));

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

        setLeaderboard((prev) => {
          const leaderboard = [...prev];
          for (let i = 0; i < data.length; i++) {
            leaderboard[i] = data[i];
          }
          leaderboard.sort((a, b) => a.score - b.score);
          return leaderboard;
        });
      } catch (error) {
        console.error("Leaderboard : Unexpected error occurred while fetching scoreboard: ", error);
      }
    };

    getLeaderboard();
  }, []);

  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>
      {leaderboard.map((entry, index) => {
        return (
          <div className={`board-entry ${getMedalClass(index + 1)}`} key={index}>
            <h2>{getPlacementIndex(index + 1)}</h2>
            <h2>{entry ? entry.name : "---"}</h2>
            <h2>{entry ? entry.score : "---"}</h2>
          </div>
        );
      })}
      <button className="return-btn" onClick={handleReturnMainPage}>
        Return
      </button>
    </div>
  );
}
