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
  TimeScale,
} from 'chart.js';
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
ChartJS.defaults.color = "#fff";
ChartJS.defaults.backgroundColor = "#fff";
ChartJS.defaults.borderColor = "rgba(100, 100, 100, 0.5)";


type DataEntry = {
  value: number,
  date: string,
};

function EntriesTable({ entries, setData }: { entries: Array<DataEntry>, setData: Function }) {
  function handleRemove(date: string) {
    const newData = entries.filter((val) => { return val.date !== date });
    setData({ entries: newData })
  }

  const listItems = entries ? entries.map((entry: DataEntry, idx: number) =>
    <li key={idx}>
      <div className="text-sm bg-slate-800 m-1 border-2 border-slate-700 rounded-sm p-2 flex justify-between gap-2">
        <div className="flex flex-col">
          <span>Value: {entry.value}</span>
        </div>
        <button className="bg-red-600 border-2 border-red-500 rounded-sm cursor-pointer p-2" onClick={() => { handleRemove(entry.date) }}>Remove</button>
      </div>
    </li>) : <span>No entries yet.</span>
  return (
    <ul>
      {listItems}
    </ul>
  )
}

export function DisplayPanel({ dataName }: { dataName: string }) {
  const [data, setData] = useData(dataName);
  const [inputVal, setInputVal] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDate(e.target.value);
  }

  const handleFormSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!inputVal || Number.isNaN(parseFloat(inputVal)) || parseFloat(inputVal) < 0 || parseFloat(inputVal) > 10) {
      return;
    }

    const newDataEntry = {
      value: parseFloat(inputVal),
      date: new Date().toISOString(),
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

  const filteredEntries = date ?
    data.entries.filter(e => {
      return new Date(e.date).toLocaleDateString("en-CA") == date
    }) : data.entries;


  const rangeBaseDate = date ? new Date(`${date}T00:00:00`) : new Date();
  const lineOptions = {
    responsive: true,
    color: "#fff",
    plugins: {
      legend: {
        display: false
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
      },
      x: {
        type: "time" as const,
        time: {
          unit: "hour" as const,
          displayFormats: { hour: "ha" },
        },
        min: new Date(rangeBaseDate).setHours(0, 0, 0, 0),
        max: new Date(rangeBaseDate).setHours(23, 59, 59, 0),
        ticks: {
          align: "start" as const,
          maxTicksLimit: 24
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
        <EntriesTable entries={filteredEntries} setData={setData} />
      </div>
    </div >
  );
};
