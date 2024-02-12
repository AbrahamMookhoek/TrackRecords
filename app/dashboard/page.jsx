import Calendar from "../components/Calendar";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { spotifyGetSavedTracks } from "@/app/utils/spotify";

import ListeningHistory from "@/app/components/ListeningHistory";
import { readFromFirestore } from "@/app/firebase/firebase";

export default async function Dashboard() {
  const session = await getServerSession(options);
  
  if (session) {
    await spotifyGetSavedTracks(session.user.spotify_access_token, session.user?.name);
    var tracks = await readFromFirestore(session.user?.name);
  }

  return (
    <div className="flex h-screen flex-col justify-between">
      <Navbar />
      <div className="flex h-full flex-row gap-5 p-5">
        <ListeningHistory />
        <Calendar />
      </div>
      <Footer />
    </div>
  );
}
