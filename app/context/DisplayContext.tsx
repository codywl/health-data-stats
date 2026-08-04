"use client";
import { createContext, useContext, useState, useEffect } from "react";

type DataEntry = {
  value: number,
  date: string,
  label: string,
};

type DataSet = {
  entries: DataEntry[]
};

type FullDataSet = Record<string, DataSet>;

function useLocalStorage<T>(key: string, fallback: T) {
  // val as a stateful value, setVal changes it
  const [val, setVal] = useState(fallback);

  // if key or fallback changes, getItem(key), set val to stored if exists, otherwise set to fallback
  useEffect(() => {
    const stored = localStorage.getItem(key);
    setVal(stored ? JSON.parse(stored) : fallback);
  }, [fallback, key]);

  // if key or val change, set key to val
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(val));
  }, [key, val]);

  return [val, setVal] as const;
}

export const DisplayContext = createContext<{
  data: FullDataSet, setNew: (key: string, dataset: DataSet) => void;
} | null>(null);

export function DisplayProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useLocalStorage<FullDataSet>("cfs-data", {})
  const setNew = (key: string, dataset: DataSet) => setData({ ...data, [key]: dataset })
  return <DisplayContext value={{ data, setNew }}>{children}</DisplayContext>
};

export function useData(dataName: string) {
  const ctx = useContext(DisplayContext);
  if (!ctx) {
    throw new Error("use useData in DisplayProvider");
  }
  const dataset = ctx.data[dataName] ?? { entries: [] };
  const setData = (ds: DataSet) => ctx.setNew(dataName, ds);
  return [dataset, setData] as const;
}
