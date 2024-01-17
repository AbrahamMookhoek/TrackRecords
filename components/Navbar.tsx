import React from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/constants";
import Button from "./Button";
import LogoutButton from "./LogoutButton";
import { signOut } from "next-auth/react";

const Navbar = () => {
  return (
    <>
      <nav className="flexBetween max-container padding-container relative z-30 py-5">
        <Link href="/">
          <Image
            src="/TrackRecordsLogo.png"
            alt="logo"
            width={70}
            height={70}
          />
        </Link>

        <ul className="hidden h-full gap-12 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              href={link.href}
              key={link.key}
              className="regular-16 text-gray-50 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold"
            >
              {link.label}
            </Link>
          ))}
        </ul>

        <div className="lg:flexCenter">
          <Link href="http://localhost:3000/dashboard/calendar">
            <LogoutButton
              type="button"
              title="Logout"
              icon="/user.svg"
              variant="btn_dark_green"
            />
          </Link>
        </div>

        <div className="lg:flexcenter">
          <button className="bold-16 btn_dark_green" onClick={() => signOut()}>
            Sign in with Spotify
          </button>
        </div>

        <Image
          src="menu.svg"
          alt="menu"
          width={32}
          height={32}
          className="inline-block cursor-pointer lg:hidden"
        />
      </nav>
    </>
  );
};

export default Navbar;
