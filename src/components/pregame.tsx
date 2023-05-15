import { useState, useCallback } from "react";
import { CellState, HoverState, Position, PregameCellInfo, PregameShip } from "../common/types";
import { shipList } from "../common/constants";
import Board from "./board";
import ShipPlacement from "./ship-placement";
import { createCellId, generateBoard, useStateRef } from "../common/utils";

export default function Pregame({ handleStartGame }: { handleStartGame: () => void }) {
  const [board, setBoard] = useState<PregameCellInfo[][]>(
    generateBoard().map((cellRow) => cellRow.map((cell) => ({ ...cell, cellState: CellState.Unoccupied })))
  );
  const [cursorPosition, setCursorPosition] = useState<Position>({ x: 0, y: 0 });

  //Keeping refs as well for the following states as they are used in event listeners
  const [ships, setShips, shipsRef] = useStateRef(
    shipList.map((ship) => {
      const newPregameShip: PregameShip = { ...ship, onBoard: false, orientation: "horizontal" };
      return newPregameShip;
    })
  );
  const [selectedShip, setSelectedShip, selectedShipRef] = useStateRef<PregameShip | null>(null);
  const [hoveredCells, setHoveredCells, hoveredCellsRef] = useStateRef<PregameCellInfo[]>([]);

  const handleMouseEnter = useCallback(
    (id: string): void => {
      if (selectedShip) {
        const hoveredCells = calculateHoveredCells(id, selectedShip.size, selectedShip.orientation);
        updateBoard(hoveredCells);
      }
    },
    [selectedShip]
  );

  const handleMouseLeave = useCallback(
    (id: string): void => {
      //Wanted to just update the hoveredCells to None instead of the whole board but it introduces a bug if I
      //move my mouse too fast across the screen which causes some cell to not update.
      //Will look into it if there's more time later on.
      updateBoard(board.flat().map((cell) => ({ ...cell, hoverState: HoverState.None })));
    },
    [selectedShip]
  );

  const handlePlaceShip = useCallback(
    (id: string): void => {
      if (hoveredCells.length > 0 && hoveredCells[0].hoverState === HoverState.Valid) {
        const newCells = hoveredCells.map((cell) => {
          cell.cellState = CellState.Occupied;
          cell.hoverState = HoverState.None;
          return cell;
        });

        // for each cell in hoveredcells, set the state to occupied and set the new board.
        updateBoard(newCells);

        //Update the placed ship in the ships list (onBoard = true).
        updateShips();

        //Remove event listeners from the placed ship
        handleShipSelect(null);
      }
    },
    [selectedShip, hoveredCells]
  );
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

  function updateBoard(targetCells: PregameCellInfo[]) {
    //Update the new board with cells in targetCells
    setBoard((currentBoard) =>
      currentBoard.map((rowCells) => {
        return rowCells.map((cell) => {
          const targetCell = targetCells.find((targetCell) => targetCell.cellId === cell.cellId);
          if (targetCell) {
            return { ...targetCell };
          } else return { ...cell };
        });
      })
    );
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
    setCursorPosition({ x: event.clientX, y: event.clientY });
  }

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

  function calculateHoveredCells(
    id: string,
    shipSize: number,
    shipOrientation: "horizontal" | "vertical"
  ): PregameCellInfo[] {
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

    // Checks if the placement is valid for the selected cells
    const validPlacement: boolean = placementIsValid(selectedCells);

    const newHoveredCells = board
      .flat()
      .filter((cell) => selectedCells.includes(cell.cellId))
      .map((cell) => {
        return { ...cell, hoverState: validPlacement ? HoverState.Valid : HoverState.Invalid };
      });

    //Update hovered cells and return it;
    setHoveredCells(newHoveredCells);
    return newHoveredCells;
  }

  //Check if the placement is valid for the current hovered cells
  function placementIsValid(cellIds: string[]): boolean {
    //If no ship selected or not all parts of the ship are inside the board, return
    if (!selectedShip || cellIds.length !== selectedShip.size) return false;

    //Check if the hovered cells are not already occupied by ships
    return board
      .flat()
      .filter((cell) => cellIds.includes(cell.cellId))
      .every((cell) => cell.cellState === CellState.Unoccupied);
  }

  return (
    <div>
      <Board
        board={board}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        handleMouseClick={handlePlaceShip}
      />
      <ShipPlacement
        ships={ships}
        handleShipSelect={handleShipSelect}
        selectedShip={selectedShip}
        cursorPosition={cursorPosition}
        handleStartGame={handleStartGame}
      />
    </div>
  );
}
