"use client";
import { AnimatePresence, motion } from "motion/react";
import { DisplayPanel } from "./DisplayPanel";
import { useEffect, useState } from "react";
import { useTabs } from "./context/DisplayContext";
import { Dialog } from "./Dialog";

export default function DisplayTabs({ tags }: { tags: string[] }) {
  const { tabs, loaded, addTab, removeTab, seedTabs } = useTabs();
  const [selectedTab, setSelectedTab] = useState(tags[0])
  const [dialogPos, setDialogPos] = useState<{ x: number, y: number } | null>(null);
  const [tabName, setTabName] = useState("Default Name");

  useEffect(() => {
    if (loaded && tabs.length < 1) {
      seedTabs(tags);
    }
  }, [loaded]);

  const handleTabSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    addTab(tabName);
    setDialogPos(null);
  }

  return (
    <div>
      <div>
        <nav className="flex w-full border border-slate-700 rounded-tl-sm rounded-tr-sm p-4">
          <ul className="flex gap-2 relative justify-around overflow-x-scroll scrollbar-thin max-w-[470px]">
            {tabs.map((item) => {
              return (
                <motion.li
                  className="min-w-32 text-center cursor-pointer flex flex-col justify-center border border-blue-900 rounded"
                  key={item.name}
                  onClick={() => setSelectedTab(item.name)}
                  layout="position"
                  initial={{ color: "#fff" }}
                >
                  <div className="flex justify-around items-center h-full">
                    <motion.span className="relative z-20 grow-2"
                    >
                      {item.name}
                    </motion.span>
                    <button className="text-xs max-w-[37px] rounded-tr-sm rounded-br-sm h-full bg-linear-to-br from-blue-800 to-blue-900 grow-1 relative z-20 px-2 cursor-pointer" onClick={() => { removeTab(item.name) }}>X</button>
                  </div>
                  {item.name === selectedTab ? (
                    <motion.div layout="position" transition={{ duration: 0.25 }} className="p-1 rounded-sm h-full bg-linear-to-br from-blue-600 to-blue-900 z-1 absolute w-32" layoutId="tab-mover" id="tab-mover" />
                  ) : null}
                </motion.li>
              )
            })}
            <button className="from-blue-400 to-blue-900 bg-linear-to-br px-2 py-1 rounded cursor-pointer" onClick={(e) => { setDialogPos({ x: e.clientX, y: e.clientY }) }}>+</button>
            <AnimatePresence>
              {dialogPos && (
                <Dialog cursorX={dialogPos.x} cursorY={dialogPos.y} onClose={() => setDialogPos(null)}>
                  <div className="bg-slate-700 rounded-sm p-2">
                    <form onSubmit={(e) => handleTabSubmit(e)}>
                      <input type="text" className="w-full h-full" placeholder="Cool tab name" value={tabName} onChange={(e) => setTabName(e.target.value)} />
                    </form>
                  </div>
                </Dialog>
              )}
            </AnimatePresence>
          </ul>
        </nav>
      </div>
      <main className="min-h-130 mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial={{ x: 25, opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.16 }}>
            <DisplayPanel dataName={selectedTab} />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
