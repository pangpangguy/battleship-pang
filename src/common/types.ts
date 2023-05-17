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
}

export interface PregameCellInfo extends CellInfo {
  cellState: CellState.Unoccupied | CellState.Occupied;
  hoverState: HoverState;
}

interface GameStartCellInfoWithShip extends CellInfo {
  cellState: CellState.Hit | CellState.Sunk;
  isDiscovered: boolean;
  shipId: string;
}

interface GameStartCellInfoWithoutShip extends CellInfo {
  cellState: CellState.Miss;
  isDiscovered: boolean;
}

export type GameStartCellInfo = GameStartCellInfoWithShip | GameStartCellInfoWithoutShip;

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
