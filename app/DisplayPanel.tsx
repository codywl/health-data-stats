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

  const handleFormSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!inputVal) {
      return;
    }

    const newDataEntry = {
      value: parseFloat(inputVal),
      date: new Date().toISOString(),
    };

    setData({ entries: [...data.entries, newDataEntry] });
    setInputVal("");
  };

  const handleResetData = () => {
    setData({ entries: [] });
  }

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
        data: data.entries.map(e => ({ x: e.date, y: e.value })),
      }
    ]
  };

  return (
    <div className="flex flex-col gap-2 min-w-2/3 min-h-2/3">
      <div className="data-title max-w-2/3">{dataName}</div>
      <div className="stats bg-slate-900 border-gray-700 border-2 rounded-sm min-h-20">
        <form onSubmit={handleFormSubmit}>
          <input type="text" value={inputVal} onChange={e => setInputVal(e.target.value)} />
          <button type="submit">Add Entry</button>
        </form>
        <button onClick={() => handleResetData()}>Reset Data</button>
        <Line data={lineData} options={lineOptions} />
      </div>
    </div>
  );
};
