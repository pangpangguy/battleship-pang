/**
 * Its Types (e.g. enums) + constants
 */

export interface ShipInterface {
  name: string;
  size: number;
  acronym: string;
  onBoard: boolean;
}

export interface SelectedShipInterface {
  shipName: String;
  shipPosition: Position;
}

export interface shipCellInterface {
  ship: ShipInterface;
  cellId: string;
}

export interface Position {
  xCoord: number;
  yCoord: number;
}

export const shipList = [
  { name: "Carrier", size: 5, acronym: "CR" },
  { name: "Battleship", size: 4, acronym: "BS" },
  { name: "Destroyer", size: 3, acronym: "DT" },
  { name: "Submarine", size: 3, acronym: "SB" },
  { name: "Patrol Boat", size: 2, acronym: "PB" },
];
