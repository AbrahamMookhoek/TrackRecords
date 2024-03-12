import Calendar from "../components/Calendar";

import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export default async function Dashboard() {
  const session = await getServerSession(options);
  return (
    <>
      {session ? <Calendar user={session.user} /> : <></>}
    </>
  );
}
