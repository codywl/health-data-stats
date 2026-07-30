"use client";
import { useState, useEffect } from "react";

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

type DataEntry = {
  value: number,
  date: string,
  label: string,
};

type DataSet = {
  entries: DataEntry[]
};

const localStorageFallback = { entries: [] };
export function DisplayData({ dataName }: { dataName: string }) {
  const [items] = useLocalStorage(dataName, localStorageFallback);
  let entries = [];

  for (let i = 0; i < items.entries.length; i++) {
    let item = items.entries[i];
    entries.push(<span key={i}>{item[dataName]}</span>);
  }

  return (
    <div className="flex flex-col gap-2 min-w-2/3 min-h-2/3">
      <div className="data-title max-w-2/3">{dataName}</div>
      <div className="stats bg-gray-700 min-h-20">{entries}</div>
    </div>
  );
};
