import { FOOTER_LINKS } from "@/constants";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="flexCenter mb-2">
      <div className="padding-container max-container flex-end w-full flex-col gap-2">
        <div className="flex flex-col items-start justify-center gap-[10%] md:flex-row">
          <div className="flex flex-wrap gap-10 sm:justify-between md:flex-1">
            {FOOTER_LINKS.map((columns) => (
              <Link href={columns.link} key={columns.link}>
                <FooterLink title={columns.title}></FooterLink>
              </Link>

              // <FooterColumn title={columns.title}>
              //   Fix this later
              //   {/* figure out why it's mad */}

              //   {/* <ul className="regular-14 flex flex-col gap-4 text-gray-30">
              //     {columns.links.map((link) => (
              //       <Link href="/" key={link}>
              //         {link}
              //       </Link>
              //     ))}
              //   </ul> */}
              // </FooterColumn>
            ))}

            {/* <div className="flex flex-col gap-5">
              <FooterColumn title={FOOTER_CONTACT_INFO.title}>
                {FOOTER_CONTACT_INFO.links.map((link) => (
                  <Link
                    href="/"
                    key={link.label}
                    className="flex gap-4 md:flex-col lg:flex-row"
                  >
                    <p className="whitespace-nowrap">
                      {link.label}:
                    </p>
                    <p className="medium-14 whitespace-nowrap text-blue-70">
                      {link.value}
                    </p>
                  </Link>
                ))}
              </FooterColumn>
            </div> */}

            {/* <div className="flex flex-col gap-5">
              <FooterColumn title={SOCIALS.title}>
                <ul className="regular-14 flex gap-4 text-gray-30">
                  {SOCIALS.links.map((link) => (
                    <Link href="/" key={link}>
                      <Image src={link} alt="logo" width={24} height={24} />
                    </Link>
                  ))}
                </ul>
              </FooterColumn>
            </div> */}
          </div>
        </div>

        {/* <div className="border bg-gray-20" /> */}
        <p className="regular-14 w-full text-center text-gray-30">
          2024 Track Records | All rights reserved
        </p>
      </div>
    </footer>
  );
};

type FooterColumnProps = {
  title: string;
};

const FooterLink = ({ title }: FooterColumnProps) => {
  return (
    <div className="flex flex-col gap-5">
      <h4 className="bold-18 whitespace-nowrap">{title}</h4>
    </div>
  );
};

export default Footer;
