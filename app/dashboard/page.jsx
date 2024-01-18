import Calendar from "@/app/components/Calendar";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div>
        <Calendar />
      </div>
      <br />
      <Footer />
    </>
  );
}
