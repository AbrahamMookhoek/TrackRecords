import Calendar from "@/app/components/Calendar";
import { getServerSession } from "next-auth";
import { options } from "../../api/auth/[...nextauth]/options";

export default async function CalendarPage() {
  const session = await getServerSession(options);

  if (session) {
    // insert some logic? :P
  }
  return (
    <>
      <Calendar />
    </>
  );
}
