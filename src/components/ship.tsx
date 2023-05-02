import { Position, ShipInterface } from "../common/types";

import "./ship.css";
import classNames from "classnames";

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
    pointerEvents: selected || ship.onBoard ? "none" : "auto",
    zIndex: selected ? 3 : 2,
  } as React.CSSProperties;

  function handleShipClick(ship: ShipInterface) {
    onShipSelect(ship);
  }

  const shipCells = [];
  for (let i = 0; i < ship.size; i++) {
    const cellId = `${ship.acronym}-${i}`;
    shipCells.push(
      <div className={classNames("ship-cell")} key={cellId}>
        {cellId}
      </div>
    );
  }
  return (
    <>
      <div
        style={style}
        className={classNames("ship", { "ship--on-board": ship.onBoard })}
        onClick={(e) => {
          e.stopPropagation();
          handleShipClick(ship);
        }}
      >
        {shipCells}
      </div>

      {/* This is the ship that is displayed in the ship placement area while the selected ship moved around*/}
      <div
        className={classNames("ship", { "ship--on-board": ship.onBoard })}
        style={{ display: selected ? "unset" : "none" }}
      >
        {shipCells}
      </div>
    </>
  );
}
