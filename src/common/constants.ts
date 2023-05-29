import { Ship } from "./types";

export const shipList: Ship[] = [
  { name: "Carrier", size: 5, acronym: "CR" },
  { name: "Battleship", size: 4, acronym: "BS" },
  { name: "Destroyer", size: 3, acronym: "DT" },
  { name: "Submarine", size: 3, acronym: "SB" },
  { name: "Patrol Boat", size: 2, acronym: "PB" },
];

export const boardSize: number = 10;

export const api: string = "https://fi3si9acoa.execute-api.ap-southeast-1.amazonaws.com/";

export const apiId: string = "pangpangguy";

export const fontSizeInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize);
