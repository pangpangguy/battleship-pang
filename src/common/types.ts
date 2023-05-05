export interface Ship {
  name: string;
  size: number;
  acronym: string;
}

export interface PregameShip extends Ship {
  onBoard: boolean;
}

//Adding an "I" in front (according to convention) to differentiate it with the Cell component
export interface ICell {
  cellId: string;
  state: CellState;
}

export interface Position {
  x: number;
  y: number;
}

export enum CellState {
  Unoccupied,
  Occupied,
  Hit,
  Miss,
  Sunk,
  Header,
}
