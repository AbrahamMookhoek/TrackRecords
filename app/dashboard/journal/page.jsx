import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import TextEditor from "@/app/components/TextEditor";
import ListeningHistory from "@/app/components/ListeningHistory";
import JournalEntryList from "@/app/components/JournalEntryList";
import { readEntriesFromFirestore } from "@/app/firebase/firebase";

export default async function JournalPage() {
  const session = await getServerSession(options);

  var firebase_entries = await readEntriesFromFirestore(session.user.name);

  return (
    <div className="grid h-full max-h-screen min-h-screen grid-cols-7 grid-rows-12 gap-y-2 bg-navy-100">
      <Navbar
        className={
          "flex-between col-span-full row-span-1 flex w-full justify-between px-32"
        }
      />
      <div className="col-span-full row-span-10 grid grid-cols-subgrid gap-x-2">
        <JournalEntryList firebase_entries={firebase_entries} />{" "}
        {/*This is what you would need to implement for the sidebar */}
        <TextEditor user={session.user} />
      </div>
      <Footer className={"flexCenter col-span-full row-span-1 w-full px-32"} />
    </div>
  );
}
