interface ShipTypeInterface {
  name: string;
  size: number;
  acronym: string;
}

export const shipList: ShipTypeInterface[] = [
  { name: "Carrier", size: 5, acronym: "CR" },
  { name: "Battleship", size: 4, acronym: "BS" },
  { name: "Destroyer", size: 3, acronym: "DT" },
  { name: "Submarine", size: 3, acronym: "SB" },
  { name: "Patrol Boat", size: 2, acronym: "PB" },
];

export const boardSize: number = 11;
