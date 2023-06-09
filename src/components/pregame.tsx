import { useState, useEffect } from "react";
import { HoverState, Position, PregameCellInfo, PregameShip } from "../common/types";
import { shipList } from "../common/constants";
import { createCellId, getMaximumPosition, useStateRef } from "../common/utils";
import Board from "./board";
import ShipPlacement from "./ship-placement";
import "./pregame.css";

interface PreGameProps {
  playerBoard: PregameCellInfo[][];
  handleUpdatePlayerBoard: (newBoard: PregameCellInfo[]) => void;
  handleStartGame: () => void;
}
export default function Pregame({ playerBoard, handleUpdatePlayerBoard, handleStartGame }: PreGameProps) {
  const [cursorPosition, setCursorPosition] = useState<Position>({ x: 0, y: 0 });
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  //Keeping refs as well for the following states as they are used in event listeners
  const [ships, setShips, shipsRef] = useStateRef(
    shipList.map((ship) => {
      const newPregameShip: PregameShip = { ...ship, onBoard: false, orientation: "horizontal" };
      return newPregameShip;
    })
  );
  const [selectedShip, setSelectedShip, selectedShipRef] = useStateRef<PregameShip | null>(null);
  const [hoveredCells, setHoveredCells] = useState<PregameCellInfo[]>([]);

  const currentHoveredCells: PregameCellInfo[] = playerBoard
    .flat()
    .filter((cell) => cell.hoverState !== HoverState.None);

  function handleMouseEnter(id: string): void {
    if (selectedShip) {
      const newHoveredCellsId = calculateHoveredCells(id, selectedShip.size, selectedShip.orientation);

      const newHoveredCells = checkPlacementIsValidAndReturnCells(newHoveredCellsId);

      //Update hovered cells and return it;
      setHoveredCells(newHoveredCells);
      handleUpdatePlayerBoard(newHoveredCells);
    }
  }

  function handleMouseLeave(): void {
    if (selectedShip) {
      const cellsToUnhover = currentHoveredCells.map((cell) => ({
        ...cell,
        hoverState: HoverState.None,
      }));

      handleUpdatePlayerBoard(cellsToUnhover);
    }
  }

  function handlePlaceShip(): void {
    if (selectedShip && currentHoveredCells.length > 0 && currentHoveredCells[0].hoverState === HoverState.Valid) {
      //Update the board with cells states set to occupied
      handleUpdatePlayerBoard(
        hoveredCells.map((cell) => {
          cell.shipId = selectedShip.acronym;
          cell.hoverState = HoverState.None;
          return cell;
        })
      );

      //Update the placed ship in the ships list (onBoard = true).
      updateShips();

      //Remove event listeners from the placed ship
      handleShipSelect(null);
    }
  }

  function handleShipRotate(event: MouseEvent): void {
    event.preventDefault();

    // If a ship is selected and the right mouse button is clicked
    if (selectedShipRef.current !== null) {
      const selectedShipName = selectedShipRef.current.name;

      // Rotate the selected ship
      const newShips: PregameShip[] = shipsRef.current.map((ship: PregameShip) => {
        if (ship.name === selectedShipName) {
          const newShip: PregameShip = {
            ...ship,
            orientation: ship.orientation === "horizontal" ? "vertical" : "horizontal",
          };
          setSelectedShip(newShip);

          //Handle the case where the ship is rotated while inside the board
          if (currentHoveredCells.length > 0) {
            //Unhover currently hovered cells
            const firstCellId = currentHoveredCells[0].cellId;
            const newHoveredCellsId = calculateHoveredCells(firstCellId, newShip.size, newShip.orientation);

            const newHoveredCells = checkPlacementIsValidAndReturnCells(newHoveredCellsId);
            const cellsToUnhover = currentHoveredCells.map((cell) => ({
              ...cell,
              hoverState: HoverState.None,
            }));
            handleUpdatePlayerBoard(newHoveredCells.concat(cellsToUnhover));
          }

          return newShip;
        } else return { ...ship };
      });
      setShips(newShips);
    }
  }

  function updateShips() {
    handleShipSelect(null);
    const newShips: PregameShip[] = ships.map((ship: PregameShip) => {
      if (ship.name === selectedShip?.name) {
        return { ...ship, onBoard: true };
      } else return { ...ship };
    });
    setShips(newShips);
  }

  function handleMouseMove(event: MouseEvent): void {
    setCursorPosition({ x: event.pageX, y: event.pageY });
  }

  function handleShipSelect(ship: PregameShip | null): void {
    setSelectedShip(ship);
  }

  function calculateHoveredCells(id: string, shipSize: number, shipOrientation: "horizontal" | "vertical"): string[] {
    // Select all cells with id's that are in the range of the ship size
    const selectedCells: string[] = [];
    const [rowNumber, colHeader] = id.split("-");

    if (shipOrientation === "horizontal") {
      for (let i = 0; i < shipSize; i++) {
        //Construct the cell Id
        const cellId: string = createCellId(parseInt(rowNumber), String.fromCharCode(colHeader.charCodeAt(0) + i));

        //Check if the cell is valid
        const newColHeaderASCII = cellId.split("-")[1].charCodeAt(0);
        if (newColHeaderASCII >= 65 && newColHeaderASCII <= 74) {
          selectedCells.push(cellId);
        }
      }
    } else {
      for (let i = 0; i < shipSize; i++) {
        // Combine the rowNumber and newColHeader to form the cellId

        const newRowHeader: number = parseInt(rowNumber) + i;
        const cellId: string = `${newRowHeader}-${colHeader}`;

        // Check if the cell Id
        if (newRowHeader <= 10 && newRowHeader >= 1) {
          selectedCells.push(cellId);
        }
      }
    }

    return selectedCells;
  }

  //Checks if the placement is valid for the input cellIds (hovered) and return the cells with the new correct hover state
  function checkPlacementIsValidAndReturnCells(cellIds: string[]): PregameCellInfo[] {
    //An extra check but shouldn't happen
    if (!selectedShipRef.current) {
      throw new Error("Unexpected error: No ship selected!");
    }

    const cellsToCheck: PregameCellInfo[] = playerBoard.flat().filter((cell) => cellIds.includes(cell.cellId));

    //A placement is valid is all parts of ships are inside the board and the hovered cells are unoccupied (shipId is undefined)
    const placementIsValid =
      cellIds.length === selectedShipRef.current.size && cellsToCheck.every((cell) => !cell.shipId);

    return cellsToCheck.map((cell) => ({
      ...cell,
      hoverState: placementIsValid ? HoverState.Valid : HoverState.Invalid,
    }));
  }

  function getWindowDimensions() {
    const width = document.documentElement.scrollWidth;
    const height = document.documentElement.scrollHeight;

    return {
      x: width,
      y: height,
    };
  }

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    if (selectedShip) {
      window.addEventListener("contextmenu", handleShipRotate);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("contextmenu", handleShipRotate);
    };
  }, [selectedShip, handleShipRotate, handleMouseMove]);

  function getPosition(): Position {
    if (!selectedShip) {
      return { x: 0, y: 0 };
    }

    const { x: maxLeft, y: maxTop } = getMaximumPosition(windowDimensions, selectedShip.size, selectedShip.orientation);

    return { x: Math.min(cursorPosition.x, maxLeft), y: Math.min(cursorPosition.y, maxTop) };
  }

  return (
    <div className="animate__animated animate__fadeIn">
      <div className="pregame-title">
        <h1>Place your ships on the board</h1>
        <h2>Click the ship once to select it and move it onto the board to place it:</h2>
      </div>
      <div className="pregame-layout">
        <div>
          <h3>Your Ships:</h3>
          <ShipPlacement
            ships={ships}
            handleShipSelect={handleShipSelect}
            selectedShip={selectedShip}
            cursorPosition={getPosition()}
            handleStartGame={handleStartGame}
          />
        </div>
        <div className="pregame-board">
          <h3>Your Board:</h3>
          <Board
            board={playerBoard}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            handleMouseClick={handlePlaceShip}
          />
        </div>
      </div>
    </div>
  );
}
