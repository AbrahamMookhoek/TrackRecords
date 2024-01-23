import CalendarPage from '@/app/dashboard/calendar/page'
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

export default async function Dashboard() {
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
