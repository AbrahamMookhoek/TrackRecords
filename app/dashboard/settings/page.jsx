import React from "react";
import Settings from "../../components/Settings";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

export default function SettingsPage() {
  return (
    <div className="grid h-full max-h-screen min-h-screen grid-cols-7 grid-rows-12 gap-y-2 bg-navy-100">
      <Navbar
        className={
          "flex-between col-span-full row-span-1 flex w-full justify-between px-32"
        }
      />
      <div className="col-span-full row-span-10 grid gap-x-2">
        <Settings />
      </div>
      <Footer className={"flexCenter col-span-full row-span-1 w-full px-32"} />
    </div>
  );
}
