import "./ship.css";
import Cell from "./cell";
export default function Ship(shipCell: { name: string; size: number; acronym: string }) {
  const shipShape = [];
  for (let i = 0; i < shipCell.size; i++) {
    const shipCellId: string = `${shipCell.acronym} - ${i + 1}`;
    shipShape.push(<Cell value={shipCellId} key={shipCellId} />);
  }
  return <div className="ship">{shipShape}</div>;
}