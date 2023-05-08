import { useState, useCallback } from "react";
import { CellState, Position, PregameShip, Ship, useStateRef } from "../common/types";
import { generateCells, shipList } from "../common/constants";
import Board from "./board";
import ShipPlacement from "./ship-placement";

export default function Pregame() {
  const [board, setBoard] = useState(generateCells());
  const [cursorPosition, setCursorPosition] = useState<Position>({ x: 0, y: 0 });

  //Keeping refs as well for the following states as they are used in event listeners
  const [ships, setShips, shipsRef] = useStateRef(
    shipList.map((ship) => ({ ...ship, onBoard: false, orientation: "horizontal" }))
  );
  const [selectedShip, setSelectedShip, selectedShipRef] = useStateRef(null);
  const [hoveredCells, setHoveredCells, hoveredCellsRef] = useStateRef([]);

  const handleMouseEnter = useCallback(
    (id: string): void => {
      if (selectedShip && checkIfCellHoverable(id)) {
        calculateHoveredCells(id, selectedShipRef.current.size, selectedShipRef.current.orientation);
      }
    },
    [board, selectedShip]
  );

  const handleMouseLeave = useCallback(
    (id: string): void => {
      if (selectedShip && checkIfCellHoverable(id)) {
        setHoveredCells([]);
      }
    },
    [board, selectedShip]
  );

  const handlePlaceShip = useCallback(
    (id: string): void => {
      if (checkIfCellHoverable(id) && hoveredCells.length > 0) {
        // for each cell in hoveredcells, set the state to occupied and set the new board.
        updateBoard();

        //Update the placed ship in the ships list (onBoard = true).
        updateShips();

        //Remove event listeners from the placed ship
        handleShipSelect(null);
      }
    },
    [hoveredCells, board]
  );

  const handleShipRotate = useCallback((event: MouseEvent): void => {
    event.preventDefault();

    // If a ship is selected and the right mouse button is clicked
    if (selectedShipRef.current && event.button === 2) {
      // Rotate the selected ship

      const newShips: PregameShip[] = shipsRef.current.map((ship: PregameShip) => {
        if (ship.name === selectedShipRef.current.name) {
          const newShip: PregameShip = {
            ...ship,
            orientation: ship.orientation === "horizontal" ? "vertical" : "horizontal",
          };

          setSelectedShip(newShip);
          if (hoveredCellsRef.current.length > 0) {
            calculateHoveredCells(hoveredCellsRef.current[0], newShip.size, newShip.orientation);
          }
          return newShip;
        } else return { ...ship };
      });
      setShips(newShips);
    }
    //Dependency is empty to make sure we remove the same function that we added in the event listener.
  }, []);

  function updateBoard() {
    // for each cell in hoveredcells, set the state to occupied and set the new board.
    const newBoard = board.map((rowCells) => {
      return rowCells.map((cell) => {
        if (hoveredCells.includes(cell.cellId)) {
          return { ...cell, state: CellState.Occupied };
        } else return { ...cell };
      });
    });
    setBoard(newBoard);
  }

  function updateShips() {
    handleShipSelect(null);
    const newShips = ships.map((ship: PregameShip) => {
      if (ship.name === selectedShip?.name) {
        return { ...ship, onBoard: true };
      } else return { ...ship };
    });
    setShips(newShips);
  }

  function handleMouseMove(event: MouseEvent): void {
    setCursorPosition({ x: event.clientX, y: event.clientY });
  }

  function handleShipSelect(ship: Ship | null): void {
    if (ship) {
      //Selects a ship
      setSelectedShip(ship);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("contextmenu", handleShipRotate);
    } else {
      //Deselects a ship
      setSelectedShip(null);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("contextmenu", handleShipRotate);
    }
  }
  function checkIfCellHoverable(id: string): boolean {
    // If a ship is not selected, return
    if (!selectedShipRef) return false;

    // If cell is a header, return
    if (id.length <= 1 || id === "10") return false;

    // Ignore cells already occupied by ships, return
    if (board.flat().find((cell) => cell.cellId === id)?.state === CellState.Occupied) return false;

    return true;
  }

  function calculateHoveredCells(id: string, shipSize: number, shipOrientation: "horizontal" | "vertical"): void {
    // Select all cells with id's that are in the range of the ship size
    const selectedCells: string[] = [];
    const [rowNumber, colHeader] = id.split("-");

    if (shipOrientation === "horizontal") {
      for (let i = 0; i < shipSize; i++) {
        // Calculate the new colHeader by incrementing the charCodeAt value
        const newColHeader: string = String.fromCharCode(colHeader.charCodeAt(0) + i);

        // Combine the rowNumber and newColHeader to form the cellId
        const cellId: string = `${rowNumber}-${newColHeader}`;

        // Check if the cell is valid for ship placement
        if (checkIfCellHoverable(cellId)) {
          selectedCells.push(cellId);
        }
      }
    } else {
      for (let i = 0; i < shipSize; i++) {
        // Combine the rowNumber and newColHeader to form the cellId
        const cellId: string = `${parseInt(rowNumber) + i}-${colHeader}`;
        // Check if the cell is valid for ship placement
        if (checkIfCellHoverable(cellId)) {
          selectedCells.push(cellId);
        }
      }
    }
    setHoveredCells(selectedCells);
  }

  return (
    <div>
      <Board
        board={board}
        hoveredCells={hoveredCells}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        handleMouseClick={handlePlaceShip}
      />
      <ShipPlacement
        ships={ships}
        handleShipSelect={handleShipSelect}
        selectedShip={selectedShip}
        cursorPosition={cursorPosition}
      />
    </div>
  );
}
