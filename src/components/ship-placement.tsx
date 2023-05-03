import { ReactElement, MouseEvent } from "react";
import { Position, ShipInterface } from "../common/types";
import Ship from "./ship";
import "./ship-placement.css";

interface ShipPlacementInterface {
  ships: ShipInterface[];
  selectedShip: ShipInterface | null;
  cursorPosition: Position;
  handleShipSelect: (ship: ShipInterface | null) => void;
}

export default function ShipPlacement({
  ships,
  selectedShip,
  cursorPosition,
  handleShipSelect,
}: ShipPlacementInterface): ReactElement {
  const renderShips: ReactElement[] = [];

  for (let i = 0; i < ships.length; i++) {
    const ship = ships[i];
    const selectedShipName = selectedShip ? selectedShip.name : "";
    const isSelected = selectedShipName === ship.name;
    renderShips.push(
      <Ship
        ship={ship}
        shipPosition={cursorPosition}
        selected={isSelected}
        onShipSelect={(ship) => handleShipSelect(ship)}
        key={ship.acronym}
      />
    );
  }
  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (event.button === 0 && selectedShip) {
      handleShipSelect(null);
    }
  }
  return (
    <div className="ship-placement" onClick={handleClick}>
      <div className="ships">{renderShips}</div>
      <button className="start-game"> Start Game</button>
    </div>
  );
}
