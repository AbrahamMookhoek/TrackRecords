import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "../components/Navbar";
import ListeningHistory from "../components/ListeningHistory";
import Footer from "../components/Footer";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Track Records",
  description: "Music Analytics Web App",
};

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/");
    return <></>;
  }

  return (
    <div className="grid h-full max-h-screen min-h-screen grid-cols-7 grid-rows-12 gap-y-2 bg-navy-100">
      {/* Persistent Navbar */}
      <Navbar className="col-span-full row-span-1 flex w-full justify-between px-32" />

      {/* Today's Tracks Sidebar */}
      <aside className="col-span-2 row-span-10 grid grid-cols-subgrid gap-x-2">
        {/* Sidebar content */}
        <ListeningHistory />
      </aside>

      {/* Main Content Section */}
      <main className="col-span-5 row-span-10 grid grid-cols-subgrid gap-x-2">{children}</main>

      {/* Footer Content Section */}
      <Footer className="col-span-full row-span-1 flexCenter w-full px-32" />
    </div>
  );
}
