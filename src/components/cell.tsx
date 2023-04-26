import { ReactElement } from "react";
import "./cell.css";

export default function Cell({ value }: { value: string }): ReactElement {
  if (value.length <= 1 || value === "10") {
    return <div className="cell header">{value}</div>;
  } else if (value.length <= 4) {
    return <div className="cell">{value}</div>;
  } else {
    return <div className="cell shipCell">{value}</div>;
  }
}
