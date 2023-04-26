import { ReactElement } from "react";
import "./board.css";
import Cell from "./cell";

export default function Board(): ReactElement {
  const size: number = 11;

  const generateGrid = (): ReactElement[] => {
    const grid: ReactElement[] = [];

    //Create first column for row header
    const headerCols: ReactElement[] = [];
    for (let i = 0; i < size; i++) {
      const cellVal = i === 0 ? "" : i.toString();
      headerCols.push(<Cell value={cellVal} key={i} />);
    }

    grid.push(
      <div className="col" key="Z">
        {headerCols}
      </div>
    );

    //Create the rest of grid, column by column
    for (let col = 1; col < size; col++) {
      const cols: ReactElement[] = [];

      //First cell in the column is the header (A to J)
      const colHeader: string = String.fromCharCode("A".charCodeAt(0) + col - 1);
      cols.push(<Cell value={colHeader} key={colHeader} />);

      for (let row = 1; row < size; row++) {
        const cellId: string = `${row}-${colHeader}`;
        cols.push(<Cell value={cellId} key={cellId} />);
      }
      grid.push(
        <div className="col" key={colHeader}>
          {cols}
        </div>
      );
    }

    return grid;
  };

  return <div className="board">{generateGrid()}</div>;
}
