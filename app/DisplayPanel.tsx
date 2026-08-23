"use client";
import { useData } from "@/app/context/DisplayContext";
import { useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { motion } from "motion/react";
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
    <motion.li key={idx} layout>
      <div className="text-sm bg-slate-800 m-1 border-2 border-slate-700 rounded-sm p-2 flex justify-between gap-2">
        <div className="flex flex-col">
          <span>Value: {entry.value}</span>
        </div>
        <button className="bg-red-600 border-2 border-red-500 rounded-sm cursor-pointer p-2" onClick={() => { handleRemove(entry.date) }}>Remove</button>
      </div>
    </motion.li>) : <span>No entries yet.</span>
  return (
    <ul>
      {listItems}
    </ul>
  )
}

function ResetButton({ handleReset }: { handleReset: Function }) {
  const [isOn, setIsOn] = useState(false)
  const toggleSwitch = () => setIsOn(!isOn)

  return (
    <div className="flex">
      <button
        className="cursor-pointer w-12 rounded-full bg-slate-500 p-1 flex"
        onClick={toggleSwitch}
        style={{ justifyContent: "flex-" + (isOn ? "end" : "start") }}
      >
        <motion.div
          className="rounded-full w-6 h-6 bg-slate-300"
          style={{ originY: "0px" }}
          layout
        />
      </button>
      <button className={(isOn ? "bg-red-500 cursor-pointer" : "bg-slate-500 opacity-50") + " rounded-sm p-1 ml-2"} onClick={() => { handleReset(); setIsOn(false) }}>Reset</button>
    </div>
  )
}

export function DisplayPanel({ dataName }: { dataName: string }) {
  const [data, setData] = useData(dataName);
  const [inputVal, setInputVal] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA").slice(0, 10));
  const [confirm, setConfirm] = useState(false);

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
    setConfirm(!confirm);
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
        <form className="p-2 flex gap-2" onSubmit={handleFormSubmit}>
          <div className="border-2 border-slate-400 p-1 rounded-sm">
            <input className="p-1 w-10 bg-slate-600 rounded" type="text" value={inputVal} placeholder="1-10" onChange={e => setInputVal(e.target.value)} />
            <button className="cursor-pointer ml-2 p-1 rounded-sm bg-slate-600" type="submit">Add Entry</button>
          </div>
          <div className="border-2 border-slate-400 p-1 rounded-sm">
            <ResetButton handleReset={handleResetData} />
          </div>
          <input className="w-38 p-1 rounded-sm bg-slate-600" type="date" name="date-start" value={date} onChange={(e) => { handleDateChange(e) }} />
        </form>
        <Line data={lineData} options={lineOptions} />
        <EntriesTable entries={filteredEntries} setData={setData} />
      </div>
    </div >
  );
};
