"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Responsive behavior: hide sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "lg:pl-72" : "lg:pl-20"
      }`}>
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center px-4 lg:px-8 sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-3 text-gray-500 hover:bg-gray-50 rounded-2xl transition-all active:scale-95"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2.5" 
                d={isSidebarOpen ? "M4 6h16M4 12h16m-7 6h7" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>
          
          <div className="ml-6 hidden md:block">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Admin Panel</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
