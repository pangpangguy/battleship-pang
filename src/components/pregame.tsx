import { useState, useCallback } from "react";
import { CellInfo, CellState, Position, PregameShip } from "../common/types";
import { boardSize, shipList } from "../common/constants";
import Board from "./board";
import ShipPlacement from "./ship-placement";
interface PregameProps {
  handleStartGame: () => void;
}

export default function Pregame({ handleStartGame }: PregameProps) {
  const generateCells = (): CellInfo[][] => {
    const output: CellInfo[][] = [];
    for (let row = 0; row < boardSize; row++) {
      const cols: CellInfo[] = [];

      for (let col = 0; col < boardSize; col++) {
        const colHeader: string = String.fromCharCode("A".charCodeAt(0) + col);
        const cellId = `${row + 1}-${colHeader}`;

        cols.push({ cellId: cellId, state: CellState.Unoccupied });
      }
      output.push(cols);
    }
    return output;
  };

  const generateShips = (): PregameShip[] => {
    return shipList.map((ship) => {
      return { ...ship, onBoard: false };
    });
  };

  const [board, setBoard] = useState(generateCells());
  const [ships, setShips] = useState(generateShips());
  const [selectedShip, setSelectedShip] = useState<PregameShip | null>(null);
  const [cursorPosition, setCursorPosition] = useState<Position>({ x: 0, y: 0 });
  const [hoveredCells, setHoveredCells] = useState<string[]>([]);

  const handleMouseEnter = useCallback(
    (id: string): void => {
      if (checkIfCellHoverable(id)) {
        const cellSelectSize = selectedShip ? selectedShip.size : 1;

        // Select all cells with id's that are in the range of the ship size
        const selectedCells: string[] = [];
        const [rowNumber, colHeader] = id.split("-");

        for (let i = 0; i < cellSelectSize; i++) {
          // Calculate the new colHeader by incrementing the charCodeAt value
          const newColHeader: string = String.fromCharCode(colHeader.charCodeAt(0) + i);

          // Combine the rowNumber and newColHeader to form the cellId
          const cellId = `${rowNumber}-${newColHeader}`;
          selectedCells.push(cellId);
        }
        setHoveredCells(selectedCells);
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
        updateBoard();
        updateShips();
      }
    },
    [hoveredCells, board, selectedShip]
  );

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

  function handleShipSelect(ship: PregameShip | null): void {
    if (selectedShip === null && ship != null) {
      setSelectedShip(ship);
      document.addEventListener("mousemove", handleMouseMove);
    } else {
      setSelectedShip(null);
      document.removeEventListener("mousemove", handleMouseMove);
    }
  }

  function checkIfCellHoverable(id: string): boolean {
    // If a ship is not selected, return
    if (!selectedShip) return false;

    // If cell is a header, return
    if (id.length <= 1 || id === "10") return false;

    // Ignore cells already occupied by ships, return
    if (board.flat().find((cell) => cell.cellId === id)?.state === CellState.Occupied) return false;

    return true;
  }

  return (
    <>
      <h2>Place your ships on the board:</h2>
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
        handleStartGame={handleStartGame}
      />
    </>
  );
}
