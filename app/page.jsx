import Header from "@/app/components/Header";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { redirect, useRouter } from "next/navigation";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

export default async function Home() {
  const session = await getServerSession(options);

  if(session){
    redirect("/dashboard")
  }

  return (
    <>
      <main className="flex flex-col h-screen justify-between">
        <Navbar />
        <br></br>
        <div className="flexCenter padding-container flex-auto">
          <h1 className="bold-64">
            Listening history, stats, journal all-in-one.
          </h1>
        </div>
        <br></br>
        <Footer />
      </main>
      
    </>
  );
}
