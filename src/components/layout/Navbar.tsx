"use client"
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { currentUser } from '../../utils/data';
import logo from '../../../public/images/logo/ANAMCARA AI LOGO ICON TRANSPARENT 2.png';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isThreadMenuOpen, setIsThreadMenuOpen] = useState(false);
  const threadMenuRef = useRef<HTMLDivElement>(null);

  // Mock notifications for UI
  const notifications = [
    {
      id: 'n1',
      title: 'New reply to your thread',
      message: 'John Doe replied to "Getting Started with React"',
      time: '5 min ago',
      read: false
    },
    {
      id: 'n2',
      title: 'Your post was liked',
      message: 'Jane Smith liked your comment in "UI Design Trends"',
      time: '1 hour ago',
      read: false
    },
    {
      id: 'n3',
      title: 'New forum announcement',
      message: 'Check out the latest community guidelines update',
      time: '1 day ago',
      read: true
    }
  ];

  const threadLinks = [
    { href: '/threads', label: 'All Threads' },
    { href: '/browse', label: 'Browse by Category' },
    { href: '/threads/new', label: 'New Thread' },
  ];

  const navLinks = [
    {
      href: '/', label: 'Home', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      href: '/threads', label: 'Threads', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      hasDropdown: true
    },
    {
      href: '/documents', label: 'Documents', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      href: '/events', label: 'Events', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      href: '/users', label: 'Members', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (threadMenuRef.current && !threadMenuRef.current.contains(event.target as Node)) {
        setIsThreadMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
    if (isThreadMenuOpen) setIsThreadMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
    if (isThreadMenuOpen) setIsThreadMenuOpen(false);
  };

  const toggleThreadMenu = () => {
    setIsThreadMenuOpen(!isThreadMenuOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname ? pathname.startsWith(href) : false;
  };

  return (
    <nav className="bg-gray-900 fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={logo}
                alt="Anamcara AI Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <span className="text-teal-800 text-lg font-semibold">NIRWANA</span>
            </Link>
          </div>


          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div key={link.href} className="relative" ref={link.hasDropdown ? threadMenuRef : null}>
                {link.hasDropdown ? (
                  <>
                    <button
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                        isActive(link.href) || isThreadMenuOpen
                          ? 'bg-teal-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                      onClick={toggleThreadMenu}
                      onMouseEnter={() => setIsThreadMenuOpen(true)}
                    >
                      {link.label}
                      <svg
                        className={`ml-1 h-4 w-4 transition-transform ${isThreadMenuOpen ? 'rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {isThreadMenuOpen && (
                      <div 
                        className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-20"
                        onMouseLeave={() => setIsThreadMenuOpen(false)}
                      >
                        <div className="py-1" role="menu" aria-orientation="vertical">
                          {threadLinks.map((subLink) => (
                            <Link
                              key={subLink.href}
                              href={subLink.href}
                              className={`block px-4 py-2 text-sm ${
                                isActive(subLink.href)
                                  ? 'bg-gray-700 text-white'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              }`}
                              onClick={() => setIsThreadMenuOpen(false)}
                            >
                              {subLink.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive(link.href)
                        ? 'bg-teal-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>


          <div className="flex items-center">

            <button className="p-1 ml-2 rounded-full text-gray-400 hover:text-white focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>


            <div className="relative ml-3">
              <button
                className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none relative"
                onClick={toggleNotifications}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>


                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-900"></span>
              </button>


              {isNotificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-20">
                  <div className="py-1" role="none">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <h3 className="text-sm font-medium text-white">Notifications</h3>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-300">
                        No new notifications
                      </div>
                    ) : (
                      <div>
                        {notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-700 ${notification.read ? '' : 'bg-gray-750'}`}
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mr-3">
                                <div className={`h-2 w-2 rounded-full mt-1 ${notification.read ? 'bg-gray-600' : 'bg-teal-500'}`}></div>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white">{notification.title}</p>
                                <p className="text-sm text-gray-400">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="px-4 py-2 border-t border-gray-700 text-center">
                          <Link href="/notifications" className="text-sm text-teal-500 hover:text-teal-400">
                            View all notifications
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative ml-3">
              <button
                className="flex items-center text-sm rounded-full focus:outline-none"
                onClick={toggleUserMenu}
              >
                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-700">
                  {currentUser.avatar ? (
                    <Image
                      src={currentUser.avatar}
                      alt={currentUser.username}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-teal-600 text-white font-medium">
                      {currentUser.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </button>

              {/* User dropdown menu */}
              {isUserMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-20">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm font-medium text-white">{currentUser.username}</p>
                      <p className="text-xs text-gray-400">{currentUser.email}</p>
                    </div>
                    <Link href={`/users/${currentUser.id}`} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      Your Profile
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      Settings
                    </Link>
                    <Link href="/logout" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      Sign out
                    </Link>
                  </div>
                </div>
              )}
            </div>

            
            <button className="ml-4 md:hidden bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path className="inline-flex" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            link.hasDropdown ? (
              <div key={link.href}>
                <button
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.href) || isThreadMenuOpen
                      ? 'bg-teal-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  onClick={() => setIsThreadMenuOpen(!isThreadMenuOpen)}
                >
                  <div className="flex items-center">
                    <span className="mr-3">{link.icon}</span>
                    {link.label}
                  </div>
                  <svg
                    className={`h-4 w-4 transition-transform ${isThreadMenuOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {isThreadMenuOpen && (
                  <div className="pl-8 pr-2 py-2 space-y-1">
                    {threadLinks.map((subLink) => (
                      <Link
                        key={subLink.href}
                        href={subLink.href}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          isActive(subLink.href)
                            ? 'bg-gray-700 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                        onClick={() => setIsThreadMenuOpen(false)}
                      >
                        {subLink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? 'bg-teal-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </div>
              </Link>
            )
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;