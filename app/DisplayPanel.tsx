"use client";
import { useData } from "@/app/context/DisplayContext";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
ChartJS.defaults.color = "#fff";
ChartJS.defaults.backgroundColor = "#fff";
ChartJS.defaults.borderColor = "rgba(100, 100, 100, 0.5)";

export function DisplayPanel({ dataName }: { dataName: string }) {
  const [data, setData] = useData(dataName);
  const [inputVal, setInputVal] = useState("");
  const [date, setDate] = useState("");

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDate(e.target.value);
  }

  const handleFormSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!inputVal) {
      return;
    }

    const newDataEntry = {
      value: parseFloat(inputVal),
      date: new Date().toLocaleString(),
    };

    if (data.entries.length === 0) {
      setData({ entries: [...data.entries, newDataEntry] });
    }
    else if (newDataEntry.date != data.entries[data.entries.length - 1].date) {
      setData({ entries: [...data.entries, newDataEntry] });
    }
    setInputVal("");
  };

  const handleResetData = () => {
    setData({ entries: [] });
  }

  const filteredEntries = date ? data.entries.filter(e => { new Date(e.date).toLocaleDateString("en-CA") === date }) : data.entries;
  const lineOptions = {
    responsive: true,
    color: "#fff",
    plugins: {
      legend: {
        display: false
      },
    },
    scales: {
      x: {
        ticks: {
          align: "start" as const,
          callback: function() {
            return null;
          }
        }
      }
    }
  };

  const lineData = {
    datasets: [
      {
        label: dataName,
        borderColor: "#fff",
        data: filteredEntries.map(e => ({ x: e.date, y: e.value })),
      }
    ]
  };

  return (
    <div className="flex flex-col gap-2 min-w-2/3 min-h-2/3">
      <div className="data-title max-w-2/3">{dataName}</div>
      <div className="stats bg-slate-900 border-gray-700 border-2 rounded-sm min-h-20">
        <form className="p-2 flex" onSubmit={handleFormSubmit}>
          <input className="p-1 w-10 bg-slate-600 rounded" type="text" value={inputVal} onChange={e => setInputVal(e.target.value)} />
          <button className="cursor-pointer ml-2 p-1 rounded-sm bg-slate-600" type="submit">Add Entry</button>
          <button className="cursor-pointer ml-2 p-1 rounded-sm bg-red-600" onClick={() => handleResetData()}>Reset Data</button>
          <input className="w-38 ml-2 p-1 rounded-sm bg-slate-600" type="date" name="date-start" onChange={(e) => { handleDateChange(e) }} />
        </form>
        <span>{date || new Date().toLocaleString().slice(0, 9)}</span>
        <Line data={lineData} options={lineOptions} />
      </div>
    </div >
  );
};
