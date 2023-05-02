/**
 * Its Types (e.g. enums) + constants
 */

export interface ShipInterface {
  name: string;
  size: number;
  acronym: string;
  onBoard: boolean;
}

export interface CellInterface {
  cellId: string;
  state: CellState;
}

export interface SelectedShipInterface {
  shipName: String;
  shipPosition: Position;
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

export enum CellState {
  Unoccupied,
  Occupied,
  Hit,
  Miss,
  Sunk,
  Header,
}
