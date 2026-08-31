"use client";
import { AnimatePresence, motion } from "motion/react";
import { DisplayPanel } from "./DisplayPanel";
import { useState } from "react";

export default function DisplayTabs({ tags }: { tags: Array<string> }) {
  const [selectedTab, setSelectedTab] = useState(tags[0])
  return (
    <div>
      <div>
        <nav className="flex w-full border border-slate-700 rounded-tl-sm rounded-tr-sm p-4">
          <ul className="flex gap-2 relative justify-around">
            {tags.map((item) => {
              return (
                <motion.li
                  className="w-32 text-center cursor-pointer flex flex-col justify-center border border-blue-600 rounded"
                  key={item}
                  onClick={() => setSelectedTab(item)}
                  layout="position"
                  initial={{ color: "#fff" }}
                >
                  <motion.span className="relative z-20"
                  >
                    {item}
                  </motion.span>
                  {item === selectedTab ? (
                    <motion.div layout="position" transition={{ duration: 0.25 }} className="p-1 rounded-sm h-full bg-linear-to-br from-blue-600 to-blue-900 z-1 absolute w-32" layoutId="tab-mover" id="tab-mover" />
                  ) : null}
                </motion.li>
              )
            })}
            <button className="from-blue-400 to-blue-900 bg-linear-to-br px-2 py-1 rounded cursor-pointer">+</button>
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
