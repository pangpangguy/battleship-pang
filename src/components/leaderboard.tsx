import { useEffect } from "react";

interface LeaderboardProps {}

export default function MainPage({}: LeaderboardProps) {
  useEffect(() => {}, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      {scores.map((score, index) => (
        <div key={index}>
          <p>
            {score.user}: {score.score}
          </p>
        </div>
      ))}
    </div>
  );
}
