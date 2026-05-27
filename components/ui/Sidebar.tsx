"use client";

import React, { useState, useEffect } from "react";
import {
  Home,
  User,
  Bell,
  Search,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Feather,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  { id: "dashboard", name: "Home", icon: Home, href: "/dashboard" },
  { id: "search", name: "Search", icon: Search, href: "/search" },
  { id: "notifications", name: "Notifications", icon: Bell, href: "/notifications" },
  { id: "profile", name: "Profile", icon: User, href: "/profile" },
];

export function Sidebar({ className = "" }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const username = user?.username ?? user?.emailAddresses[0]?.emailAddress?.split("@")[0] ?? "";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(true);
      else setIsOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleItemClick = () => {
    if (window.innerWidth < 768) setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "?";

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={toggleSidebar}
        className="fixed top-6 left-6 z-50 p-3 rounded-lg bg-black border border-white/10 md:hidden hover:bg-white/10 transition-all duration-200"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-white" />
        ) : (
          <Menu className="h-5 w-5 text-white" />
        )}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-black border-r border-white/10 z-40
          transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-72"}
          md:translate-x-0 md:static md:z-auto
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center">
                <Feather className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">Threadly</span>
            </div>
          )}

          {isCollapsed && (
            <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center mx-auto">
              <Feather className="w-5 h-5 text-white" />
            </div>
          )}

          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1.5 rounded-md hover:bg-white/10 transition-all duration-200"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-white/50" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-white/50" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.id}>
                  <Link
                    href={item.id === "profile" ? `/profile/${username}` : item.href}
                    onClick={handleItemClick}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group
                      ${isActive
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                      }
                      ${isCollapsed ? "justify-center px-2" : ""}
                    `}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-sky-400" : ""}`} />

                    {!isCollapsed && (
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-sm ${isActive ? "font-semibold" : "font-normal"}`}>
                          {item.name}
                        </span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-sky-500/20 text-sky-400">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom — User + Logout */}
        <div className="border-t border-white/10">
          {/* User info */}
          <div className={`border-b border-white/10 ${isCollapsed ? "py-3 px-2" : "p-3"}`}>
            {!isCollapsed ? (
              <div className="flex items-center px-3 py-2 rounded-xl hover:bg-white/5 transition-colors duration-200">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  {user?.imageUrl ? (
                    <Image src={user.imageUrl} alt="avatar" width={32} height={32} className="rounded-full object-cover" />
                  ) : (
                    <span className="text-white font-medium text-sm">{initials}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0 ml-2.5">
                  <p className="text-sm font-medium text-white truncate">{user?.fullName ?? "User"}</p>
                  <p className="text-xs text-white/40 truncate">
                    @{user?.username ?? user?.emailAddresses[0]?.emailAddress?.split("@")[0]}
                  </p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                    {user?.imageUrl ? (
                      <Image src={user.imageUrl} alt="avatar" width={36} height={36} className="rounded-full object-cover" />
                    ) : (
                      <span className="text-white font-medium text-sm">{initials}</span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                </div>
              </div>
            )}
          </div>

          {/* Logout */}
          <div className="p-3">
            <button
              onClick={handleSignOut}
              className={`
                w-full flex items-center rounded-xl text-left transition-all duration-200 group
                text-red-400 hover:bg-red-500/10 hover:text-red-300
                ${isCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"}
              `}
              title={isCollapsed ? "Logout" : undefined}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
