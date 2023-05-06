import { ReactElement, MouseEvent } from "react";
import { Position, PregameShip } from "../common/types";
import Ship from "./ship";
import "./ship-placement.css";

interface ShipPlacementInterface {
  ships: PregameShip[];
  selectedShip: PregameShip | null;
  cursorPosition: Position;
  handleShipSelect: (ship: PregameShip | null) => void;
}

export default function ShipPlacement({
  ships,
  selectedShip,
  cursorPosition,
  handleShipSelect,
}: ShipPlacementInterface): ReactElement {
  const renderShips: ReactElement[] = [];

  for (let i = 0; i < ships.length; i++) {
    const ship: PregameShip = ships[i];
    const selectedShipName: string | null = selectedShip?.name ?? "";
    const isSelected: boolean = selectedShipName === ship.name;
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
  function handleDeselectShip(event: MouseEvent<HTMLDivElement>) {
    // If the user clicks on the ship placement area while a ship is selected, deselect the ship
    if (event.button === 0 && selectedShip) {
      handleShipSelect(null);
    }
  }
  return (
    <div className="ship-placement" onClick={handleDeselectShip}>
      <div className="ships">{renderShips}</div>
      <button className="start-game"> Start Game</button>
    </div>
  );
}
