"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { logo } from '../../../public';
import { FiUser, FiLogOut, FiMessageSquare, FiSettings, FiSearch, FiBell } from 'react-icons/fi';
import { PiUserCircleDashed } from 'react-icons/pi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthProvider';
import PrimaryButton from '../addons/PrimaryButton';
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const router = useRouter()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { accessToken, loading, logout, userData } = useAuth();


  const placeholders = [
    "Search Threads...",
    "Search Trending Topics...",
    "Search Solutions...",
  ];

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const goToUserProfile = () => {
    if (userData?.id) {
      router.push(`/users/${userData.id}`);
      setIsUserMenuOpen(false);
    }
  };

  useEffect(() => {
    if (searchValue.length > 0) return;

    const interval = setInterval(() => {
      setCurrentPlaceholderIndex((prev) =>
        prev === placeholders.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [searchValue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-900 fixed top-0 left-0 w-full h-[70px] px-4 md:px-6 lg:px-8 flex items-center justify-between z-10">

      <div className="flex-shrink-0 flex items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className='relative md:h-10 md:w-10 w-8 h-8'>
            <Image
              src={logo}
              alt="Anamcara AI Logo"
              fill
              sizes='( max-width: 768px) 32px, 40px'
              className="object-cover"
            />
          </div>
          <span className="text-teal-500 text-lg font-semibold hidden sm:inline">NIRWANA</span>
        </Link>
      </div>

      <div className="flex-1 max-w-2xl mx-4 px-2 md:mx-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="md:h-5 md:w-5 w-4 h-4 text-gray-400" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder=""
            className="block w-full md:pl-10 pl-8 md:pr-3 pr-2 py-2 md:text-sm text-xs rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <AnimatePresence mode="wait">
            {searchValue.length === 0 && (
              <motion.div
                key={currentPlaceholderIndex}
                className="absolute inset-y-0 left-10 flex items-center pointer-events-none"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                onClick={() => searchInputRef.current?.focus()}
              >
                <span className="text-gray-400 md:text-sm text-xs">
                  {placeholders[currentPlaceholderIndex]}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center md:gap-4 gap-2">
        {/* <button className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none relative">
          <FiBell className="md:w-6 md:h-6 w-5 h-5" />
          <span className="absolute top-0 right-0 block md:h-2 md:w-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-gray-900"></span>
        </button> */}

        <div className="relative ml-2" ref={userMenuRef}>
          {loading ? (
            <div className='py-2'>
              <div className="w-7 h-7 rounded-full bg-gray-700 animate-pulse" />
            </div>
          ) : (
            !accessToken ?
              <PrimaryButton text={"Sign in"} onClick={() => router.push("/login")} className='!py-2' />
              : (
                <button
                  className="flex items-center text-sm rounded-full focus:outline-none transition-transform hover:scale-105 duration-200"
                  onClick={toggleUserMenu}
                >
                  <div className="md:w-8 md:h-8 w-6 h-6 rounded-full cursor-pointer overflow-hidden bg-gray-700 flex items-center justify-center">

                    {userData.avatar_url && userData.first_name ? (
                      <div className="relative md:w-8 md:h-8 w-6 h-6">
                        <Image
                          src={userData.avatar_url}
                          alt={userData.first_name}
                          fill
                          sizes="(max-width: 768px) 24px, 32px"
                          className="rounded-full object-cover"
                        />
                      </div>

                    ) : (
                      <PiUserCircleDashed className="h-6 w-6 text-teal-500 transition-all duration-300 hover:text-teal-400" />
                    )}
                  </div>
                </button>
              )
          )}

          {isUserMenuOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-20 animate-scaleIn">
              <div className="py-1" role="menu">

                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-sm font-medium text-white capitalize">{userData.first_name}{userData.last_name ? ` ${userData.last_name}` : ''}</p>
                  <p className="text-xs text-gray-400 truncate">{userData.email}</p>
                </div>


                <button
                  onClick={goToUserProfile}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                >
                  <FiUser className="mr-3 h-5 w-5 text-gray-400" />
                  Your Profile
                </button>

                <Link
                  href="/your-threads"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                >
                  <FiMessageSquare className="mr-3 h-5 w-5 text-gray-400" />
                  Your Posted Threads
                </Link>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    logout()
                  }} className="w-full cursor-pointer flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white border-t border-gray-700 transition-colors duration-150"
                >
                  <FiLogOut className="mr-3 h-5 w-5 text-gray-400" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;