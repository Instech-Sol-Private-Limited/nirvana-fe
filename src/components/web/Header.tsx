"use client";

import Link from "next/link";
import React, { useState, useEffect, Key } from "react";
import { usePathname, useRouter } from "next/navigation";
import { navlinks } from "@/constants";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import PrimaryButton from "@/components/addons/buttons/PrimaryButton";
import Image from "next/image";

interface NavLink {
  id: Key | null | undefined;
  label: string;
  hasSubmenu?: Boolean;
  submenu?: any;
  url: string;
}

const Header: React.FC = () => {
  const pathname: string = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [scrollBg, setScrollBg] = useState<boolean>(false);
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);

  useEffect(() => {
    if (
      pathname === "/privacy-policy" ||
      pathname === "/terms-and-conditions" ||
      pathname.startsWith("/resources") ||
      pathname.startsWith("/jobs")
    ) {
      setIsScrolled(true);
      setScrollBg(false);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
        setScrollBg(true);
      } else {
        setIsScrolled(false);
        setScrollBg(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return (
    <div
      className={`w-full fixed z-[999] top-0 left-0 xl:py-8 sm:py-5 py-3 xl:px-16 sm:px-10 px-5 flex items-center justify-between transition-colors duration-300 ${
        isScrolled
          ? `bg-white  ${scrollBg ? "shadow-lg" : ""} text-primary`
          : "bg-transparent text-white"
      }`}
    >
      {/* Logo */}
      <Link
        href="/"
        className={`font-montserrat font-bold xl:text-2xl sm:text-xl text-lg ${
          isScrolled ? `text-gradient` : "text-white"
        }`}
      >
        Gulf Schooling
      </Link>

      {/* Desktop Navbar */}
      <div className="hidden lg:flex">
        <ul className="flex items-center justify-center 2xl:gap-5 gap-3.5">
          {navlinks.map((item: NavLink) => (
            <li key={item.id} className="relative group">
              <Link
                href={item.url}
                className={`${
                  pathname === item.url ? "font-extrabold" : "font-semibold"
                } font-montserrat 2xl:text-lg xl:text-base text-sm`}
              >
                <span>{item.label}</span>
              </Link>

              {/* Mega Menu */}
              {item?.hasSubmenu && (
                <div
                  className="absolute top-full pt-4 2xl:w-[879px] w-[750px] h-fit opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 transition-all duration-200"
                  style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                    maxWidth: "calc(100vw - 20px)",
                  }}
                >
                  <div className="text-black bg-white shadow-accordion overflow-y-auto rounded-[20px] p-9">
                    <p className="-translate-x-6 transition-all duration-500 group-hover:translate-x-0 font-montserrat font-bold text-lg text-primary tracking-[0.54px]">
                      {item.label}
                    </p>

                    <div className="-translate-x-6 transition-all duration-500 group-hover:translate-x-0 w-full grid lg:grid-cols-2 grid-cols-1 gap-6 pt-6">
                      {item.submenu.map((elem: any) => (
                        <Link
                          href={elem.url}
                          key={elem.id}
                          className="py-5 px-3 rounded-[20px] flex gap-3 hover:bg-[#F9F9F9] border border-transparent hover:border-[#F9F9F9] transition-all duration-300"
                        >
                          <Image
                            src={elem.icon}
                            alt={elem.label}
                            fill
                            className="!relative !w-[44px] !h-fit -translate-x-6 transition-all duration-500 group-hover:translate-x-0"
                          />

                          <div className="space-y-3 -translate-x-6 transition-all duration-500 group-hover:translate-x-0">
                            <h3 className="font-montserrat text-textdark font-semibold text-lg tracking-[0.54px]">
                              {elem.label}
                            </h3>
                            <p className="text-textlight font-montserrat text-sm font-normal">
                              {elem.tagline}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Off-Canvas Navbar */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-35 z-40 transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:hidden`}
      >
        <div className="bg-secondary w-4/5 overflow-y-auto max-w-[550px] h-full p-5 flex flex-col">
          <button
            type="button"
            title="Close Menu"
            onClick={() => setIsMenuOpen(false)}
            className="self-end text-black text-2xl mb-4"
          >
            <FiX />
          </button>

          <ul className="flex flex-col gap-5 flex-grow">
            {navlinks.map((item: NavLink, index) => (
              <li key={item.id} className="relative">
                <button
                  className={`text-primary ${
                    pathname === item.url ? "font-extrabold" : "font-semibold"
                  } font-montserrat md:text-lg text-base flex justify-between w-full items-center`}
                  onClick={() => {
                    if (item.hasSubmenu) {
                      setOpenSubmenu(openSubmenu === index ? null : index);
                    } else {
                      setIsMenuOpen(false);
                    }
                  }}
                >
                  <span>{item.label}</span>
                  {item.hasSubmenu && (
                    <FiChevronDown
                      className={`text-lg transition-transform duration-300 ${
                        openSubmenu === index ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  )}
                </button>

                {/* Submenu for Mobile */}
                {item?.hasSubmenu && (
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      openSubmenu === index
                        ? "max-h-[500px] opacity-100 pt-4"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="pl-1 border-l border-gray-300">
                      {item.submenu.map((elem: any) => (
                        <li key={elem.id} className="mb-2">
                          <Link
                            href={elem.url}
                            className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100 transition-all duration-300"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Image
                              src={elem.icon}
                              alt={elem.label}
                              width={24}
                              height={24}
                              className="flex-shrink-0"
                            />
                            <div>
                              <h3 className="font-montserrat text-textdark font-semibold text-sm">
                                {elem.label}
                              </h3>
                              <p className="text-textlight font-montserrat text-xs">
                                {elem.tagline}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <PrimaryButton text="Sign In" />
        </div>
      </div>

      {/* Sign In */}
      <div className="flex items-center gap-3">
        <div className="lg:block hidden">
          <PrimaryButton
            onClick={() => router.push("/select-role")}
            text="Sign In"
          />
        </div>

        <button
          type="button"
          title="Open Menu"
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden text-2xl"
        >
          <FiMenu />
        </button>
      </div>
    </div>
  );
};

export default Header;
