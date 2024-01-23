"use client";

import React from "react";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";

type ButtonProps = {
  type: "button" | "submit";
  icon?: string;
  variant: "btn_dark_green";
  session: boolean
};

const UserSignInButton = ({ type, icon, variant, session }) => {
  if (session) {
    return (
      <>
        <button
          type={type}
          className={`flexCenter gap-3 rounded-full border ${variant}`}
          onClick={() => signOut({
            redirect: true,
            callbackUrl: `${window.location.origin}/`
          })}
        >
          {icon && (
            <Image src={icon} alt={"Logout Button"} width={24} height={24} />
          )}
          <label className="bold-16 whitespace-nowrap">Logout of Spotify</label>
        </button>
      </>
    );
  } else {
    return (
      <button
        type={type}
        className={`flexCenter gap-3 rounded-full border ${variant}`}
        onClick={() => signIn('spotify')}
      >
        {icon && (
          <Image src={icon} alt={"Login Button"} width={24} height={24} />
        )}
        <label className="bold-16 whitespace-nowrap">
          Sign in with Spotify
        </label>
      </button>
    );
  }
};

export default UserSignInButton;
