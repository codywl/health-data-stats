"use client";
import { AnimatePresence, motion } from "motion/react";
import { DisplayPanel } from "./DisplayPanel";
import { useEffect, useState } from "react";
import { useTabs } from "./context/DisplayContext";

export default function DisplayTabs({ tags }: { tags: string[] }) {
  const { tabs, loaded, addTab, seedTabs } = useTabs();
  const [selectedTab, setSelectedTab] = useState(tags[0])

  useEffect(() => {
    if (loaded && tabs.length < 1) {
      seedTabs(tags);
    }
  }, [loaded]);

  return (
    <div>
      <div>
        <nav className="flex w-full border border-slate-700 rounded-tl-sm rounded-tr-sm p-4">
          <ul className="flex gap-2 relative justify-around overflow-x-scroll scrollbar-thin max-w-[470px]">
            {tabs.map((item) => {
              return (
                <motion.li
                  className="min-w-32 text-center cursor-pointer flex flex-col justify-center border border-blue-600 rounded"
                  key={item.name}
                  onClick={() => setSelectedTab(item.name)}
                  layout="position"
                  initial={{ color: "#fff" }}
                >
                  <motion.span className="relative z-20"
                  >
                    {item.name}
                  </motion.span>
                  {item.name === selectedTab ? (
                    <motion.div layout="position" transition={{ duration: 0.25 }} className="p-1 rounded-sm h-full bg-linear-to-br from-blue-600 to-blue-900 z-1 absolute w-32" layoutId="tab-mover" id="tab-mover" />
                  ) : null}
                </motion.li>
              )
            })}
            <button className="from-blue-400 to-blue-900 bg-linear-to-br px-2 py-1 rounded cursor-pointer" onClick={() => { addTab("a") }}>+</button>
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
