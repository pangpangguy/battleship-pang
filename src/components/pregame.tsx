import { useState, useCallback } from "react";
import { CellInterface, CellState, Position, ShipInterface, useStateRef } from "../common/types";
import Board from "./board";
import ShipPlacement from "./ship-placement";
import { boardSize, shipList } from "../common/constants";

export default function Pregame() {
  const generateCells = (): CellInterface[][] => {
    const output: CellInterface[][] = [];
    for (let row = 0; row < boardSize - 1; row++) {
      const cols: CellInterface[] = [];

      for (let col = 0; col < boardSize - 1; col++) {
        const colHeader: string = String.fromCharCode("A".charCodeAt(0) + col);
        const cellId: string = `${row + 1}-${colHeader}`;

        cols.push({ cellId: cellId, state: CellState.Unoccupied });
      }
      output.push(cols);
    }
    return output;
  };

  const generateShips = (): ShipInterface[] => {
    return shipList.map((ship) => {
      return { ...ship, onBoard: false, orientation: "horizontal" };
    });
  };

  const [board, setBoard] = useState(generateCells());
  const [ships, setShips, shipsRef] = useStateRef(generateShips());
  const [selectedShip, setSelectedShip, selectedShipRef] = useStateRef(null);
  const [cursorPosition, setCursorPosition] = useState<Position>({ xCoord: 0, yCoord: 0 });
  const [hoveredCells, setHoveredCells, hoveredCellsRef] = useStateRef([]);

  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");

  const handleMouseEnter = useCallback(
    (id: string): void => {
      if (checkIfCellHoverable(id)) {
        console.log("here");
        calculateHoveredCells(id, selectedShipRef.current.size, selectedShipRef.current.orientation);
      }
    },
    [board, selectedShip]
  );

  const handleMouseLeave = useCallback(
    (id: string): void => {
      if (checkIfCellHoverable(id)) {
        setHoveredCells([]);
      }
    },
    [board, selectedShip]
  );

  const handleMouseClick = useCallback(
    (id: string): void => {
      if (checkIfCellHoverable(id)) {
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
    event.stopPropagation();

    // If a ship is selected and the right mouse button is clicked
    if (selectedShipRef.current && event.button === 2) {
      // Rotate the selected ship

      const newShips: ShipInterface[] = shipsRef.current.map((ship: ShipInterface) => {
        if (ship.name === selectedShipRef.current.name) {
          const newShip: ShipInterface = {
            ...ship,
            orientation: ship.orientation === "horizontal" ? "vertical" : "horizontal",
          };
          console.log("rotate!");

          setSelectedShip(newShip);
          if (hoveredCellsRef.current.length > 0) {
            calculateHoveredCells(hoveredCellsRef.current[0], newShip.size, newShip.orientation);
          }
          console.log(newShip.orientation);
          return newShip;
        } else return { ...ship };
      });
      setShips(newShips);

      setOrientation(orientation === "horizontal" ? "vertical" : "horizontal");
    }
    //Dependency is empty to make sure we remove the same function that we added.
  }, []);

  function handleShipSelect(ship: ShipInterface | null): void {
    if (!selectedShip && ship) {
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
    if (id.length <= 1 || id === "10") return false;

    // Ignore cells already occupied by ships, return
    if (board.flat().find((cell) => cell.cellId === id)?.state === CellState.Occupied) return false;

    // If a ship is not selected, return
    if (!selectedShip) return false;

    return true;
  }

  function calculateHoveredCells(id: string, shipSize: number, shipOrientation: "horizontal" | "vertical"): void {
    // Select all cells with id's that are in the range of the ship size
    const selectedCells: string[] = [];
    const [rowNumber, colHeader] = id.split("-");

    console.log("shipSize: ", shipSize);
    console.log("shipOrientation: ", shipOrientation);
    console.log("orientation: ", orientation);

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
        handleMouseClick={handleMouseClick}
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
