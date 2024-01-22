import Calendar from "@/app/components/Calendar";
import CalendarPage from '@/app/dashboard/calendar/page'
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div>
        <CalendarPage />
      </div>
      <br />
      <Footer />
    </>
  );
}
