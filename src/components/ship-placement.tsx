import { ReactElement } from "react";
import Ship from "./ship";
import "./ship-placement.css";

interface Ship {
  name: string;
  size: number;
  acronym: string;
}

const shipList: Ship[] = [
  { name: "Carrier", size: 5, acronym: "CR" },
  { name: "Battleship", size: 4, acronym: "BS" },
  { name: "Destroyer", size: 3, acronym: "DT" },
  { name: "Submarine", size: 3, acronym: "SB" },
  { name: "Patrol Boat", size: 2, acronym: "PB" },
];

export default function ShipPlacement(): ReactElement {
  const renderShips: React.ReactElement[] = [];
  shipList.forEach((ship) => {
    renderShips.push(<Ship {...ship} key={ship.acronym} />);
  });
  return (
    <div className="ship-placement">
      <div className="ships">{renderShips}</div>
      <button className="start-game"> Start Game</button>
    </div>
  );
}
