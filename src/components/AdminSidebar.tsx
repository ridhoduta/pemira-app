"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: "Voters",
    href: "/admin/voters",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    name: "Candidates",
    href: "/admin/candidates",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM14 4v4h4" />
      </svg>
    ),
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar aside */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          isOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full lg:translate-x-0 lg:w-20"
        }`}
      >
        <div className={`p-8 border-b border-gray-50 flex items-center justify-between overflow-hidden whitespace-nowrap`}>
          <h1 className={`text-2xl font-black text-brand-600 tracking-tighter transition-opacity duration-300 ${
            !isOpen && "lg:opacity-0"
          }`}>
            PEMIRA ADMIN
          </h1>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-100 scale-[1.02]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className={`${isActive ? "text-white" : "text-gray-400"} flex-shrink-0`}>
                  {item.icon}
                </div>
                <span className={`transition-opacity duration-300 ${!isOpen && "lg:opacity-0"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50 overflow-hidden whitespace-nowrap">
          <Link
            href="/"
            className="flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <div className="flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className={`transition-opacity duration-300 ${!isOpen && "lg:opacity-0"}`}>
              Exit Admin
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
