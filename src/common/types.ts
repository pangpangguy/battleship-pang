export interface Ship {
  name: string;
  size: number;
  acronym: string;
}

export interface PregameShip extends Ship {
  onBoard: boolean;
  orientation: "horizontal" | "vertical";
}

export interface CellInfo {
  cellId: string;
  cellState: CellState;
  hoverState: HoverState;
}

export interface PregameCellInfo extends CellInfo {
  cellState: CellState.Unoccupied | CellState.Occupied;
}

export interface GameStartCellInfo extends CellInfo {
  cellState: CellState.Hit | CellState.Miss | CellState.Sunk;
  discovered: boolean;
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
}

export enum HoverState {
  Valid,
  Invalid,
  None,
}

export enum GamePhase {
  PreGame,
  GameStart,
  GameEnd,
}
