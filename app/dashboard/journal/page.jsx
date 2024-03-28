/*import Image from 'next/image'

export default function JournalPage() {
  return (
  )
}*/

import TextEditor from "@/app/components/TextEditor";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export default async function JournalPage() {
  const session = await getServerSession(options);
  return <TextEditor user={session.user} />;
}
