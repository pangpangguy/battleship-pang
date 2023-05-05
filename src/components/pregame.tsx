import { useState, useCallback } from "react";
import { CellState, Position, PregameCell, ShipInterface, useStateRef } from "../common/types";
import Board from "./board";
import ShipPlacement from "./ship-placement";
import { generateBoard, shipList } from "../common/constants";

export default function Pregame() {
  const generatePregameBoard = (): PregameCell[][] => {
    const board = generateBoard();
    return board.map((row) => {
      return row.map((cell) => {
        return { ...cell, cellState: CellState.Unoccupied, isHovered: "none" };
      });
    });
  };
  const [board, setBoard] = useState<PregameCell[][]>(generatePregameBoard());
  const [cursorPosition, setCursorPosition] = useState<Position>({ xCoord: 0, yCoord: 0 });

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
      if (selectedShip && hoveredCells.length === selectedShip.size) {
        // for each cell in hoveredcells, set the state to occupied and set the new board.
        const newBoard = board.map((rowCells) => {
          return rowCells.map((cell) => {
            if (hoveredCells.includes(cell.cellId)) {
              return { ...cell, state: CellState.Occupied };
            } else return { ...cell };
          });
        });
        setBoard(newBoard);

        //Update the placed ship in the ships list (onBoard = true).
        const newShips = ships.map((ship: ShipInterface) => {
          if (ship.name === selectedShip.name) {
            return { ...ship, onBoard: true };
          } else return { ...ship };
        });
        setShips(newShips);

        //Remove event listeners from the placed ship
        handleShipSelect(null);
      }
    },
    [hoveredCells, board]
  );

  const handleMouseMove = useCallback((event: MouseEvent): void => {
    setCursorPosition({ xCoord: event.clientX, yCoord: event.clientY });
  }, []);

  const handleShipRotate = useCallback((event: MouseEvent): void => {
    event.preventDefault();

    // If a ship is selected and the right mouse button is clicked
    if (selectedShipRef.current && event.button === 2) {
      // Rotate the selected ship

      const newShips: ShipInterface[] = shipsRef.current.map((ship: ShipInterface) => {
        if (ship.name === selectedShipRef.current.name) {
          const newShip: ShipInterface = {
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

  function handleShipSelect(ship: ShipInterface | null): void {
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
    // Ignore header cells return
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

        //Check if the cell is valid for ship placement
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

        // Check if the cell is valid for ship placement
        if (checkIfCellHoverable(cellId) && newRowHeader <= 10 && newRowHeader >= 1) {
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
