import Calendar from "@/app/components/Calendar";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export default async function CalendarPage(){
  const session = await getServerSession(options);
  return (
    <Calendar user={session.user}/>
  )
}