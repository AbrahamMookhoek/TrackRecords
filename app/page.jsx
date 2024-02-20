import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

export default async function Home() {
  const session = await getServerSession(options);

  return (
    <div className="grid h-full max-h-screen min-h-screen grid-cols-7 grid-rows-12 gap-y-2 text-black">
      <Navbar
        className=
          "flex-between col-span-full row-span-1 flex w-full justify-between px-32 py-1"
        
      />
      <div className="col-span-full row-span-10 flex items-center justify-center gap-x-2 ">
        <h1 className="bold-64">
          Listening history, stats, journal all-in-one.
        </h1>
      </div>
      <Footer className={"flexCenter col-span-full row-span-1 w-full px-32"} />
    </div>
  );
}
