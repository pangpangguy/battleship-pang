import { useCallback, useState } from "react";
import { GameStartCellInfo } from "./types";

export function useBattleshipAI(playerBoard: GameStartCellInfo[][]) {
  const [aiHitList, setAIHitList] = useState<GameStartCellInfo[]>([]);

  const addCellToHitList = useCallback((cell: GameStartCellInfo) => {
    setAIHitList((prev) => [...prev, cell]);
  }, []);

  const getAICellToAttack = useCallback((): GameStartCellInfo => {
    // If aiHitList is not empty, pop a cell from the list to attack
    if (aiHitList.length > 0) {
      const cellToAttack = aiHitList.pop();
      setAIHitList(aiHitList);
      if (cellToAttack) {
        return cellToAttack;
      }
    }

    // Else, select a random undiscovered cell from the player's board
    const undiscoveredCells = playerBoard.flat().filter((cell) => !cell.isDiscovered);
    return undiscoveredCells[Math.floor(Math.random() * undiscoveredCells.length)];
  }, [aiHitList, playerBoard]);

  return {
    aiHitList,
    addCellToHitList,
    getAICellToAttack,
  };
}
