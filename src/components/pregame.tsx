import { useState, useCallback, useRef } from "react";
import { CellInterface, CellState, Position, ShipInterface } from "../common/types";
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
  const [ships, setShips] = useState(generateShips());
  const selectedShip = useRef<ShipInterface | null>(null);
  const [cursorPosition, setCursorPosition] = useState<Position>({ xCoord: 0, yCoord: 0 });
  const [hoveredCells, setHoveredCells] = useState<string[]>([]);

  const handleMouseEnter = useCallback(
    (id: string): void => {
      if (cellCanBeHovered(id)) {
        const cellSelectSize = selectedShip.current ? selectedShip.current.size : 1;

        // Select all cells with id's that are in the range of the ship size
        const selectedCells: string[] = [];
        const [rowNumber, colHeader] = id.split("-");

        for (let i = 0; i < cellSelectSize; i++) {
          // Calculate the new colHeader by incrementing the charCodeAt value
          const newColHeader: string = String.fromCharCode(colHeader.charCodeAt(0) + i);

          // Combine the rowNumber and newColHeader to form the cellId
          const cellId: string = `${rowNumber}-${newColHeader}`;

          // Check if the cell is valid for ship placement
          selectedCells.push(cellId);
        }
        setHoveredCells(selectedCells);
      }
    },
    [board, selectedShip]
  );

  const handleMouseLeave = useCallback(
    (id: string): void => {
      if (cellCanBeHovered(id)) {
        setHoveredCells([]);
      }
    },
    [board, selectedShip]
  );

  const handleMouseClick = useCallback(
    (id: string): void => {
      if (cellCanBeHovered(id)) {
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
          if (ship.name === selectedShip.current?.name) {
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

  function handleMouseMove(event: MouseEvent): void {
    setCursorPosition({ xCoord: event.clientX, yCoord: event.clientY });
  }

  function handleShipRotate(event: MouseEvent): void {
    event.preventDefault();

    // If a ship is selected and the right mouse button is clicked
    if (selectedShip.current !== null && event.button === 2) {
      // Rotate the selected ship
      const newShips: ShipInterface[] = ships.map((ship: ShipInterface) => {
        if (ship.name === selectedShip.current!.name) {
          return { ...ship, orientation: ship.orientation === "horizontal" ? "vertical" : "horizontal" };
        } else return { ...ship };
      });
      setShips(newShips);
    }
  }

  function handleShipSelect(ship: ShipInterface | null): void {
    if (selectedShip.current === null && ship) {
      selectedShip.current = ship;
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("contextmenu", handleShipRotate);
    } else {
      selectedShip.current = null;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("contextmenu", handleShipRotate);
    }
  }

  function cellCanBeHovered(id: string): boolean {
    // If a ship is not selected, return
    if (id.length <= 1 || id === "10") return false;

    // Ignore cells already occupied by ships, return
    if (board.flat().find((cell) => cell.cellId === id)?.state === CellState.Occupied) return false;

    // If a ship is not selected, return
    if (!selectedShip.current) return false;

    return true;
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
        selectedShip={selectedShip.current}
        cursorPosition={cursorPosition}
      />
    </div>
  );
}
