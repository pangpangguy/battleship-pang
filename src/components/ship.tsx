import { ReactElement, CSSProperties } from "react";
import { Position, PregameShip } from "../common/types";

import "./ship.css";
import classNames from "classnames";

export default function Ship({
  ship,
  shipPosition,
  onShipSelect,
  selected,
}: {
  ship: PregameShip;
  shipPosition: Position;
  onShipSelect: (ship: PregameShip) => void;
  selected: boolean;
}) {
  //Dynamically set the position of the ship when it is selected so it follows the cursor
  const positionStyle = {
    left: `${shipPosition.x}px`,
    top: `${shipPosition.y}px`,
    position: selected ? "absolute" : "static",
    pointerEvents: selected || ship.onBoard ? "none" : "auto",
    zIndex: selected ? 3 : 2,
  } as CSSProperties;

  function handleShipClick(ship: PregameShip) {
    onShipSelect(ship);
  }

  const shipCells: ReactElement[] = [];
  for (let i = 0; i < ship.size; i++) {
    const cellId = `${ship.acronym}-${i}`;
    shipCells.push(<div className={classNames("ship-cell")} key={cellId}></div>);
  }
  return (
    <>
      {!ship.onBoard && (
        <div
          style={positionStyle}
          className={classNames("ship", {
            "ship-cell--vertical": selected && ship.orientation === "vertical",
          })}
          onClick={(e) => {
            e.stopPropagation();
            handleShipClick(ship);
          }}
        >
          {shipCells}
        </div>
      )}
      {/* This is the ship that is displayed in the ship placement area while the selected ship moved around*/}
      <div className={selected || ship.onBoard ? "ship-disabled-overlay" : "ship-disabled-overlay--hide"}>
        {shipCells}
      </div>
    </>
  );
}
