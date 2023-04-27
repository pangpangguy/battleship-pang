import { useState } from "react";
import { Position, ShipInterface } from "../common/types";

import "./ship.css";
export default function Ship({
  ship,
  shipPosition,
  onShipSelect,
  selected,
}: {
  ship: ShipInterface;
  shipPosition: Position;
  onShipSelect: (ship: ShipInterface) => void;
  selected: boolean;
}) {
  const style = {
    left: `${shipPosition.xCoord}px`,
    top: `${shipPosition.yCoord}px`,
    position: selected ? "absolute" : "static",
  } as React.CSSProperties;

  function handleShipClick(ship: ShipInterface) {
    onShipSelect(ship);
  }

  const shipCells = [];
  for (let i = 0; i < ship.size; i++) {
    const cellId = `${ship.acronym}-${i}`;
    shipCells.push(
      <div className="ship-cell" key={cellId}>
        {cellId}
      </div>
    );
  }
  return (
    <div style={style} className="ship" onClick={() => handleShipClick(ship)}>
      {shipCells}
    </div>
  );
}
