import React from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/constants";
import UserSignInButton from "./UserSignInButton";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";


const Navbar = async () => {
  const session = await getServerSession(options)

  const sessionBool = session != undefined ? true : false
  return (
    <>
      <nav className="w-full flexBetween max-container padding-container relative z-30 py-5">
        <Link href="/">
          <h3 className="text-2xl font-Lobster">Track Records</h3>
        </Link>

        {/* <ul className="hidden h-full gap-12 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              href={link.href}
              key={link.key}
              className="regular-16 text-gray-50 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold"
            >
              {link.label}
            </Link>
          ))}
        </ul> */}

        <UserSignInButton type="button" icon="/user.svg" variant="btn_dark_green" session={sessionBool}/>

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
