import Calendar from "../components/Calendar";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import ListeningHistory from "../components/ListeningHistory";

export default async function Dashboard() {
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
