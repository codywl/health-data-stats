import { AnimatePresence, motion } from "motion/react";
// Create an element at the cursor position to show children elements.
export function Dialog(
  { children, cursorY, cursorX, onClose }:
    {
      children: React.ReactNode,
      cursorY: number,
      cursorX: number,
      onClose: Function
    }) {
  return (
    <>
      <div className="fixed inset-0" onClick={() => onClose()} />
      <motion.div initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", top: cursorY, left: cursorX, zIndex: 1 }}>
        {children}
      </motion.div>
    </>
  )
}
