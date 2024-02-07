import Calendar from "@/app/components/Calendar";
import { getServerSession } from "next-auth";
import { options } from "../../api/auth/[...nextauth]/options";
import { spotifyGetSavedTracks } from "@/app/utils/spotify";

export default async function CalendarPage() {
  const session = await getServerSession(options);

  spotifyGetSavedTracks(session.user.spotify_access_token)

  if (session) {
    // insert some logic? :P
  }
  return (
    <>
      <Calendar />
    </>
  );
}
