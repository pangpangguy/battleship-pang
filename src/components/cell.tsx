import "./cell.css";

export default function Cell({ value }: { value: string }) {
  if (value.length <= 1 || value == "10") {
    return <div className="cell header">{value}</div>;
  } else {
    return <div className="cell">{value}</div>;
  }
}
