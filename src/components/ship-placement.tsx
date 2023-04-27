import { useState, useRef, ReactElement } from "react";
import { Position, SelectedShipInterface, ShipInterface, shipList } from "../common/types";
import Ship from "./ship";
import "./ship-placement.css";

export default function ShipPlacement(): ReactElement {
  const [selectedShip, setSelectedShip] = useState<String | null>(null);
  const [cursorPosition, setCursorPosition] = useState<Position>({ xCoord: 0, yCoord: 0 });

  const ships: ShipInterface[] = shipList.map((ship) => {
    return {
      ...ship,
      onBoard: false,
    };
  });

  const renderShips: React.ReactElement[] = ships.map((ship) => {
    const isSelected = selectedShip == ship.name;
    return (
      <Ship
        ship={ship}
        shipPosition={cursorPosition}
        selected={isSelected}
        onShipSelect={handleShipSelect}
        key={ship.acronym}
      />
    );
  });

  function handleMouseMove(event: MouseEvent): void {
    setCursorPosition({ xCoord: event.clientX, yCoord: event.clientY });
  }

  function handleShipSelect(ship: ShipInterface) {
    if (selectedShip == null) {
      setSelectedShip(ship.name);
      document.addEventListener("mousemove", handleMouseMove);
    } else {
      setSelectedShip(null);
      document.removeEventListener("mousemove", handleMouseMove);
    }
  }

  return (
    <div className="ship-placement">
      <div className="ships">{renderShips}</div>
      <button className="start-game"> Start Game</button>
    </div>
  );
}
