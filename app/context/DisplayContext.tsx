"use client";
import { createContext, useContext, useState, useEffect } from "react";

type PaneDataEntry = {
  value: number,
  date: string,
};

type Tab = {
  name: string;
  entries: PaneDataEntry[];
};

type AppData = {
  tabs: Tab[];
};

function useLocalStorage<T>(key: string, fallback: T) {
  // val as a stateful value, setVal changes it
  const [val, setVal] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);

  // if there's data already, use it
  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      setVal(JSON.parse(stored));
    }
    setLoaded(true);
  }, [key]);

  // set localStorage[key] to val if loaded already
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(key, JSON.stringify(val));
    }
  }, [key, val]);

  return [val, setVal, loaded] as const;
}

// pass a context down that contains data: AppData (Record<string, DataSet>)
// this allows child components to get setNew, taking a key and an object representing the dataset
export const AppContext = createContext<{
  data: AppData,
  setData: (data: AppData) => void;
  loaded: boolean;
} | null>(null);

// child components inside appprovider get the data set and a function to set new values on it
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData, loaded] = useLocalStorage<AppData>("cfs-data", { tabs: [] })
  return <AppContext value={{ data, setData, loaded }}>{children}</AppContext>
};

// import to get the default data set or the one retrieved in localstorage from dataName, plus setData
// (as long as there is a DisplayContext parent in the form of DisplayProvider)
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("use useDataPanes in DisplayProvider");
  }
  return ctx;
}

export function useTabs() {
  const { data, setData, loaded } = useAppContext();
  const addTab = (name: string) => {
    setData({ tabs: [...data.tabs, { name, entries: [] }] })
  };
  const seedTabs = (names: string[]) => {
    setData({ tabs: names.map(name => ({ name, entries: [] })) })
  };
  return { tabs: data.tabs, loaded, addTab, seedTabs };
}

export function useTab(name: string) {
  const { data, setData } = useAppContext();
  const tab = data.tabs.find(t => t.name === name);
  const entries = tab?.entries ?? [];
  const setEntries = (entries: PaneDataEntry[]) => {
    setData({ tabs: data.tabs.map(t => t.name === name ? { ...t, entries } : t) })
  }
  return [entries, setEntries] as const;

}
