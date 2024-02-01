import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

export default async function Home() {
  const session = await getServerSession(options);

  return (
    <>
      <main className="flex h-screen flex-col justify-between">
        <Navbar />
        <div className="flexCenter padding-container flex-auto">
          <h1 className="bold-64">
            Listening history, stats, journal all-in-one.
          </h1>
        </div>
        <Footer />
      </main>
    </>
  );
}
