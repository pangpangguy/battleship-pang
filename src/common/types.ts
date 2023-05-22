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
  shipId?: string;
}

export interface PregameCellInfo extends CellInfo {
  hoverState: HoverState;
}

export interface GameStartCellInfo extends CellInfo {
  isDiscovered: boolean;
  cellState: CellState;
}

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  gamePhase: GamePhase;
  playerBoard: PregameCellInfo[][] | GameStartCellInfo[][];
  opponentBoard?: GameStartCellInfo[][];
}

export enum CellState {
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
