import Image from "next/image";
import DisplayTabs from "./DisplayTabs";

export default function Home() {
  return (
    <div className="flex flex-1 flex-wrap items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col justify-center items-center w-full h-screen py-32 px-16 bg-white dark:bg-black">
        <DisplayTabs tags={["Energy", "Brain Fog", "Mood"]} />
      </main>
    </div>

  );
}
