import { useState, useCallback } from "react";
import { CellInfo, CellState, Position, PregameShip, useStateRef } from "../common/types";
import { generateBoard, shipList } from "../common/constants";
import Board from "./board";
import ShipPlacement from "./ship-placement";

export default function Pregame() {
  const [board, setBoard] = useState<CellInfo[][]>(generateBoard());
  const [cursorPosition, setCursorPosition] = useState<Position>({ x: 0, y: 0 });

  //Keeping refs as well for the following states as they are used in event listeners
  const [ships, setShips, shipsRef] = useStateRef(
    shipList.map((ship) => {
      const newPregameShip: PregameShip = { ...ship, onBoard: false, orientation: "horizontal" };
      return newPregameShip;
    })
  );
  const [selectedShip, setSelectedShip, selectedShipRef] = useStateRef<PregameShip | null>(null);
  const [hoveredCells, setHoveredCells, hoveredCellsRef] = useStateRef<string[]>([]);

  const handleMouseEnter = useCallback(
    (id: string): void => {
      if (selectedShip) {
        calculateHoveredCells(id, selectedShip.size, selectedShip.orientation);
      }
    },
    [board, selectedShip]
  );

  const handleMouseLeave = useCallback(
    (id: string): void => {
      if (selectedShip) {
        setHoveredCells([]);
      }
    },
    [board, selectedShip]
  );

  const handlePlaceShip = useCallback(
    (id: string): void => {
      if (selectedShip && placementIsValid()) {
        updateBoard();
        updateShips();

        //Remove event listeners from the placed ship
        handleShipSelect(null);
      }
    },
    [hoveredCells, board]
  );

  function updateBoard() {
    const newBoard: CellInfo[][] = board.map((rowCells) => {
      return rowCells.map((cell) => {
        if (hoveredCells.includes(cell.cellId)) {
          return { ...cell, cellState: CellState.Occupied };
        } else return { ...cell };
      });
    });
    setBoard(newBoard);
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

  const handleMouseMove = useCallback((event: MouseEvent): void => {
    setCursorPosition({ x: event.clientX, y: event.clientY });
    //Dependency is empty to make sure we remove the same function that we have attached to the event listener.
  }, []);

  const handleShipRotate = useCallback((event: MouseEvent): void => {
    event.preventDefault();

    // If a ship is selected and the right mouse button is clicked
    if (selectedShipRef.current !== null && event.button === 2) {
      const selectedShipName = selectedShipRef.current.name;

      // Rotate the selected ship
      const newShips: PregameShip[] = shipsRef.current.map((ship: PregameShip) => {
        if (ship.name === selectedShipName) {
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
    //Dependency is empty to make sure we remove the same function that we have attached to the event listener.
  }, []);

  function handleShipSelect(ship: PregameShip | null): void {
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

        //Check if the cell is valid
        const newColHeaderASCII = newColHeader.charCodeAt(0);
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
    setHoveredCells(selectedCells);
  }

  //Check if the placement is valid for the current hovered cells
  function placementIsValid(): boolean {
    //If no ship selected or not all parts of the ship are inside the board, return
    if (!selectedShip || hoveredCells.length !== selectedShip.size) return false;

    //Check if the hovered cells are not already occupied by ships
    return board
      .flat()
      .filter((cell) => hoveredCells.includes(cell.cellId))
      .every((cell) => cell.cellState === CellState.Unoccupied);
  }

  return (
    <div>
      <Board
        board={board}
        hoveredCells={{ cells: hoveredCells, isValid: placementIsValid() }}
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
