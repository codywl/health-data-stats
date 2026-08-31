"use client";
import { AnimatePresence, motion } from "motion/react";
import { DisplayPanel } from "./DisplayPanel";
import { useState } from "react";

export default function DisplayTabs({ tags }: { tags: Array<string> }) {
  const [selectedTab, setSelectedTab] = useState(tags[0])
  return (
    <div style={{ minHeight: "100vh" }}>
      <div>
        <nav className="flex w-full border border-amber-500 rounded-sm p-2">
          <ul className="flex w-full gap-2 relative justify-around">
            {tags.map((item) => {
              return (
                <motion.li
                  className="w-32 text-center cursor-pointer"
                  key={item}
                  onClick={() => setSelectedTab(item)}
                  layout="position"
                >
                  <span className="relative z-20">
                    {item}
                  </span>
                  {item === selectedTab ? (
                    <motion.div layout="position" transition={{ duration: 0.15 }} className="rounded-sm h-full w-full bg-amber-500 z-1 relative bottom-full" layoutId="tab-mover" id="tab-mover" />
                  ) : null}
                </motion.li>
              )
            })}
          </ul>
        </nav>
      </div>
      <main className="min-h-[520px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}>
            <DisplayPanel dataName={selectedTab} />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
