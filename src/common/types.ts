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
  shipName: string;
  shipPosition: Position;
}

export interface Position {
  xCoord: number;
  yCoord: number;
}

export enum CellState {
  Unoccupied,
  Occupied,
  Hit,
  Miss,
  Sunk,
  Header,
}
