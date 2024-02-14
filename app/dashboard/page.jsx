import Calendar from "../components/Calendar";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { spotifyGetSavedTracks } from "@/app/utils/spotify";

import ListeningHistory from "@/app/components/ListeningHistory";
import { readTracksFromFirestore } from "@/app/firebase/firebase";

export default async function Dashboard() {
  const session = await getServerSession(options);
  
  if (session) {
    await spotifyGetSavedTracks(session.user.spotify_access_token, session.user?.name);
    var tracks = await readTracksFromFirestore(session.user?.name);
  }

  return (
    <div className="bg-navy-100 grid h-full max-h-screen min-h-screen grid-cols-7 grid-rows-12 gap-y-2">
      <Navbar
        className={
          "flex-between col-span-full row-span-1 flex w-full justify-between px-32"
        }
      />
      <div className="col-span-full row-span-10 grid grid-cols-subgrid gap-x-2">
        <ListeningHistory />
        <Calendar />
      </div>
      <Footer className={"flexCenter col-span-full row-span-1 w-full px-32"} />
    </div>

    // <div className="flex h-screen flex-col justify-between">
    //   <Navbar />
    //   <div className="flex h-full flex-row gap-5 p-5">
    //     <ListeningHistory />
    //     <Calendar />
    //   </div>
    //   <Footer />
    // </div>
  );
}
