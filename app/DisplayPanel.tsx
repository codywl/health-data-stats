"use client";
import { useTab } from "@/app/context/DisplayContext";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { AnimatePresence, motion } from "motion/react";
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
import { Dialog } from "./Dialog";
import VanillaCalendar from "./VanillaCalendar";

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
    setData(newData)
  }

  const listItems = entries.length > 0 ? entries.map((entry: DataEntry) => {
    return (<motion.li key={entry.date} initial={{ opacity: 0.8 }} animate={{ opacity: 1.0 }} exit={{ opacity: 0 }}>
      <div className="text-sm bg-slate-800 m-1 border border-slate-700 rounded-sm p-2 flex justify-between gap-2">
        <div className="flex flex-col">
          <span>Value: {entry.value}</span>
          <span>Date: {new Date(entry.date).toLocaleString()}</span>
        </div>
        <button className="bg-red-600 border border-red-500 rounded-sm cursor-pointer p-2" onClick={() => { handleRemove(entry.date) }}>Remove</button>
      </div>
    </motion.li>)
  }) : <span className="p-2 m-auto">No entries yet.</span>
  return (
    <ul className="max-h-40 min-h-40 overflow-scroll flex flex-col align-center">
      <AnimatePresence>
        {listItems}
      </AnimatePresence>
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
      <button
        disabled={!isOn}
        className={(isOn ? "bg-red-500 cursor-pointer" : "bg-slate-500 opacity-50") + " rounded-sm p-1 ml-2"}
        onClick={() => { handleReset(); setIsOn(false) }}>Reset</button>
    </div>
  )
}

export function DisplayPanel({ dataName }: { dataName: string }) {
  const [AMPM, setAMPM] = useState<"AM" | "PM">("AM");
  const [confirm, setConfirm] = useState(false);
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA").slice(0, 10));
  const [dateDialogPos, setDateDialogPos] = useState<{ x: number, y: number } | null>(null);
  const [entries, setEntries] = useTab(dataName);
  const [inputVal, setInputVal] = useState("");
  const [isRange, setRange] = useState(false);
  const [manualDate, setManualDate] = useState(new Date().toLocaleDateString("en-CA").slice(0, 10));
  const [manualDialogPos, setManualDialogPos] = useState<{ x: number, y: number } | null>(null);
  const [manualInputVal, setManualInputVal] = useState("");
  const [manualTime, setManualTime] = useState(1);
  const [rangeDate, setRangeDate] = useState({ min: "", max: "" });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDate(e.target.value);
  };

  const handleManualDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setManualDate(e.target.value);
  };

  const handleManualFormSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    const thisDate = new Date(`${manualDate}T00:00:00`);
    thisDate.setHours(AMPM == "AM" ? manualTime : manualTime + 12);
    const manualDataEntry = {
      value: parseFloat(manualInputVal),
      date: thisDate.toISOString()
    }

    if (entries.length === 0) {
      setEntries([...entries, manualDataEntry]);
    }
    else if (manualDataEntry.date != entries[entries.length - 1].date) {
      const sortedData = [...entries, manualDataEntry].sort((a, b) => { return (a.date > b.date ? 1 : -1) });
      setEntries(sortedData);
    }

  };

  const handleExportData = (e: React.MouseEvent) => {
    e.preventDefault();
    let result = `${dataName},Date\n`;
    for (const entry of entries) {
      result += entry.value + "," + entry.date + "\n";
    }
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataName.toLowerCase().split(' ').join('')}-data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadData = async function(e: React.MouseEvent) {
    e.preventDefault();
    const filePickerElem = document.createElement('input');
    filePickerElem.setAttribute("type", "file");
    async function handleFileChange(this: HTMLInputElement) {
      const files = this.files;
      if (files) {
        const text = await files[0].text();
        const parsed = text.split("\n").slice(1).map((val) => { return { value: parseFloat(val.split(",")[0]), date: val.split(",")[1] } });
        const combined = Array.from(
          new Map([...entries, ...parsed]
            .map(e => [e.date, e])).values())
          .sort((a, b) => a.date > b.date ? 1 : -1);
        setEntries(combined);
      }
    }
    filePickerElem.addEventListener("change", handleFileChange);
    filePickerElem.click();
  };

  const handleFormSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!inputVal || Number.isNaN(parseFloat(inputVal)) || parseFloat(inputVal) < 0 || parseFloat(inputVal) > 10) {
      return;
    }

    const newDataEntry = {
      value: parseFloat(inputVal),
      date: new Date().toISOString(),
    };

    if (entries.length === 0) {
      setEntries([...entries, newDataEntry]);
    }
    else if (newDataEntry.date != entries[entries.length - 1].date) {
      setEntries([...entries, newDataEntry]);
    }
    setInputVal("");
  };

  const handleResetData = () => {
    setEntries([]);
    setConfirm(!confirm);
  };

  const filteredEntries = isRange && rangeDate.max && rangeDate.min ?
    entries.filter(e => {
      const date = new Date(e.date).toLocaleDateString("en-CA");
      return date >= rangeDate.min && date <= rangeDate.max;
    }) : date ?
      entries.filter(e => {
        return new Date(e.date).toLocaleDateString("en-CA") == date
      }) : entries;


  const rangeBaseDate = date ? new Date(`${date}T00:00:00`) : new Date();
  const lineOptions = !isRange ? {
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
          maxTicksLimit: 6
        }
      }
    }
  } : {
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
          unit: "day" as const,
        },
        displayFormats: { day: "MMM d" },
        min: new Date(`${rangeDate.min}T00:00:00`).getTime(),
        max: new Date(`${rangeDate.max}T23:59:59`).getTime(),
        ticks: {
          align: "start" as const,
          maxTicksLimit: 6
        }
      }
    }
  }

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
    <div className="flex flex-col gap-2 min-h-2/3">
      <div className="stats bg-slate-900 border-gray-700 border rounded-bl-sm rounded-br-sm min-h-20 justify-around">
        <h1 className="text-xl px-2 pt-2 data-title max-w-2/3">{dataName}</h1>

        <form className="p-2 flex gap-2 justify-between" onSubmit={handleFormSubmit}>
          <div className="border border-slate-700 p-1 rounded-sm">
            <input className="p-1 w-10 bg-slate-600 rounded" type="text" value={inputVal} placeholder="1-10" onChange={e => setInputVal(e.target.value)} />
            <button className="cursor-pointer ml-2 p-1 rounded-sm bg-slate-600" type="submit">Add Entry</button>
          </div>
          <div className="border border-slate-700 p-1 rounded-sm">
            <ResetButton handleReset={handleResetData} />
          </div>
          <div className="border border-slate-700 p-1 rounded-sm">
            <input className="w-38 p-1 rounded-sm bg-slate-600" type="date" name="date-start" value={date} onChange={(e) => { handleDateChange(e) }} />
          </div>
        </form>

        <div className="px-2 pb-2 flex gap-2">
          <div className="p-1 rounded-sm flex gap-2 w-full justify-between">
            <button className="cursor-pointer p-1 rounded-sm from-blue-400 to-blue-700 bg-linear-to-br  border-blue-500 border" onClick={(e) => { setManualDialogPos({ x: e.clientX, y: e.clientY }) }}>⚙ Manual</button>
            <button className="cursor-pointer p-1 rounded-sm from-green-400 to-green-700 bg-linear-to-br  border-green-500 border" onClick={(e) => handleExportData(e)}>💾 Export Data</button>
            <button className="cursor-pointer p-1 rounded-sm from-yellow-400 to-yellow-700 bg-linear-to-br  border-yellow-500 border" onClick={(e) => handleLoadData(e)}>⇅ Load Data</button>
            <button className="cursor-pointer p-1 rounded-sm from-teal-400 to-teal-700 bg-linear-to-br  border-teal-500 border" onClick={(e) => { setDateDialogPos({ x: e.clientX, y: e.clientY }) }}>📅 Range</button>
          </div>
        </div>
        {isRange ? <div className="px-3 pb-2 flex gap-2"><button className="cursor-pointer p-1 rounded-sm from-red-400 to-yellow-700 bg-linear-to-br" onClick={() => setRange(false)}>→ Exit Range</button></div> : ""}

        <AnimatePresence>
          {dateDialogPos && (
            <Dialog cursorX={dateDialogPos.x} cursorY={dateDialogPos.y} onClose={() => setDateDialogPos(null)}>
              <VanillaCalendar config={{
                selectionDatesMode: "multiple-ranged",
                onClickDate(self, event) {
                  if (self.context.selectedDates.length > 1) {
                    setRange(true);
                    setRangeDate({ min: self.context.selectedDates[0], max: self.context.selectedDates[1] })
                    setDateDialogPos(null);
                  }
                }
              }} />
            </Dialog>
          )
          }
        </AnimatePresence>
        <AnimatePresence>
          {manualDialogPos && (
            <Dialog cursorX={manualDialogPos.x} cursorY={manualDialogPos.y} onClose={() => setManualDialogPos(null)}>
              <motion.form className="p-2 flex gap-2 shadow-2xl bg-slate-800 rounded-sm" onSubmit={handleManualFormSubmit}>
                <div className="border border-slate-700 p-1 rounded-sm flex gap-2 justify-around w-full">
                  <input className="p-1 w-10 bg-slate-600 rounded" type="text" value={manualTime} placeholder="1-12" onChange={e => setManualTime(parseFloat(e.target.value) || "")} />
                  <label htmlFor="radio-am" className="h-6 self-center">AM</label>
                  <input type="radio" id="radio-am" value="AM" name="ampm" onChange={() => setAMPM("AM")} />
                  <label htmlFor="radio-pm" className="h-6 self-center">PM</label>
                  <input type="radio" id="radio-pm" value="PM" name="ampm" onChange={() => setAMPM("PM")} />
                </div>
                <div className="border border-slate-700 p-1 rounded-sm flex gap-2 justify-around w-full">
                  <input className="w-38 p-1 rounded-sm bg-slate-600" type="date" name="date-manual" value={manualDate} onChange={(e) => { handleManualDateChange(e) }} />
                </div>
                <div className="border border-slate-700 p-1 rounded-sm flex gap-2 justify-around w-full">
                  <input className="p-1 w-10 bg-slate-600 rounded" type="text" value={manualInputVal} placeholder="1-10" onChange={e => setManualInputVal(e.target.value)} />
                  <button className="cursor-pointer p-1 rounded-sm bg-blue-400" type="submit">Add Entry</button>
                </div>
              </motion.form>
            </Dialog>
          )}
        </AnimatePresence>


        <Line data={lineData} options={lineOptions} />
        <EntriesTable entries={filteredEntries} setData={setEntries} />
      </div>
    </div >
  );
};
