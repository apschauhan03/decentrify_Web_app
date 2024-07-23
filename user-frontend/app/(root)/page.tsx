import {Exo} from "next/font/google";
const exo = Exo({
    weight: '400',
    subsets: ['latin'],
  })
import TaskCreate from "@/Components/TaskCreate";

export default function Home() {
  return (
    <div className="  h-auto min-h-screen flex flex-col justify-center items-center " >
       <section className="flex p-4 flex-col text-xl justify-center items-center w-1/2">
                    <span className={exo.className}>Labelling your data has never been easier</span>
                </section>
      <TaskCreate/>
    </div>
  );
}
