import React from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/constants";
import UserSignInButton from "./UserSignInButton";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import UserProfile from "./UserProfile";

const Navbar = async () => {
  const session = await getServerSession(options);
  const sessionBool = session != undefined ? true : false;

  return (
    <>
      <nav className="flexBetween max-container padding-container relative z-30 w-full py-5">
        <Link href="/">
          <h3 className="font-Lobster text-2xl">Track Records</h3>
        </Link>

        {sessionBool ? (
          <>
            <ul className="hidden h-full gap-12 lg:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  href={link.href}
                  key={link.key}
                  className="regular-16 flexCenter cursor-pointer pb-1.5 text-gray-50 transition-all hover:font-bold"
                >
                  {link.label}
                </Link>
              ))}
            </ul>
            <UserProfile />
          </>
        ) : (
          <UserSignInButton
            type="button"
            icon="/user.svg"
            variant="btn_dark_green"
            session={sessionBool}
          />
        )}

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
