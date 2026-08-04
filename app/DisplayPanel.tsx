"use client";
import { useData } from "@/app/context/DisplayContext";
import { useState } from "react";

export function DisplayPanel({ dataName }: { dataName: string }) {
  const [data, setData] = useData(dataName);
  const [inputVal, setInputVal] = useState("");
  const [inputLabel, setInputLabel] = useState("");

  const handleFormSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!inputVal) {
      return;
    }

    const newDataEntry = {
      value: parseFloat(inputVal),
      date: new Date().toLocaleString(),
      label: inputLabel || "Unnamed Entry"
    };

    setData({ entries: [...data.entries, newDataEntry] });
    setInputVal("");
    setInputLabel("");
  };

  return (
    <div className="flex flex-col gap-2 min-w-2/3 min-h-2/3">
      <div className="data-title max-w-2/3">{dataName}</div>
      <div className="stats bg-gray-700 min-h-20">
        <form onSubmit={handleFormSubmit}>
          <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)} />
          <input type="text" value={inputLabel} onChange={e => setInputLabel(e.target.value)} />
          <button type="submit">Add Entry</button>
        </form>
        <ul>
          {data.entries.map((entry, i) => (
            <li>
              <li key={i}>{entry.value}, {entry.date}, {entry.label}</li>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
