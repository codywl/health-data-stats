import { useData } from "@/app/context/DisplayContext";
export function DisplayPanel({ dataName }: { dataName: string }) {
  for (let i = 0; i < items.entries.length; i++) {
    let item = items.entries[i];
    entries.push(<span key={i}>{item.value}</span>);
  }

  return (
    <div className="flex flex-col gap-2 min-w-2/3 min-h-2/3">
      <div className="data-title max-w-2/3">{dataName}</div>
      <div className="stats bg-gray-700 min-h-20">{entries}</div>
    </div>
  );
};
