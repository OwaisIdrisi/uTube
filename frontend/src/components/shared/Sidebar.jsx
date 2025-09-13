/* eslint-disable no-unused-vars */
import { cn } from "@/lib/utils";
import {
  Home,
  Clapperboard,
  History,
  PlaySquare,
  Clock,
  ThumbsUp,
  Flame,
  Bell,
  BellDotIcon,
  X,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import { logout } from "@/api/auth";
import { logoutState, SetError } from "@/features/authSlice";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

const items = [
  { Icon: Home, label: "Home", href: "/" },
  { Icon: Flame, label: "Tweets", href: "/tweets" },
  { Icon: Bell, label: "Subscriptions", href: "/subscriptions" },
  { Icon: ThumbsUp, label: "Liked videos", href: "/liked" },
  // { Icon: History, label: "History", href: "/history" },
  // { Icon: BellDotIcon, label: "Notifications", href: "/notifications" },
  // { Icon: PlaySquare, label: "Your videos", href: "/library" },
];



export function Sidebar({ collapsed, setCollapsed }) {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
         const response = await logout();
         console.log(response.data);
         dispatch(logoutState());
         toast("Logout successful");
       } catch (error) {
         toast.error("Logout failed");
         console.error("Logout failed:", error);
         dispatch(SetError("Logout failed"));
       }
  }
  return (
    <>
      {/* --- Desktop Sidebar --- */}
      <aside
        className={cn(
          "hidden md:block h-[calc(100vh-56px)] shrink-0 overflow-y-auto border-r bg-background pb-4 transition-all duration-300",
          collapsed ? "w-20" : "w-64"
        )}
        aria-label="Sidebar"
      >
        <nav className="px-2 py-2 grid gap-2">
          {items.map(({ Icon, label, href }) => (
            <NavLink
              key={label}
              to={href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 hover:bg-primary hover:text-primary-foreground text-gray-600",
                  collapsed && "flex-col gap-1 px-0 py-3 text-xs",
                  isActive && "bg-primary text-primary-foreground"
                )
              }
              aria-label={label}
            >
              <Icon className="size-5" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
          <hr />
          <NavLink
            key={"Profile"}
            to={"/profile"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-md px-3 py-2 hover:bg-primary hover:text-primary-foreground text-gray-600",
                collapsed && "flex-col gap-1 px-0 py-3 text-xs",
                isActive && "bg-primary text-primary-foreground"
              )
            }
            aria-label={"Profile"}
          >
            <User className="size-5" />
            {!collapsed && <span>{"Profile"}</span>}
          </NavLink>
        </nav>
      </aside>

      {/* --- Mobile Sidebar (Sheet) --- */}
      {/* Overlay */}
      {collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setCollapsed(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-gray-800 z-50 transform transition-transform duration-300 md:hidden",
          collapsed ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h2 className="text-white font-semibold">Menu</h2>
          <button
            onClick={() => setCollapsed(false)}
            className="p-2 rounded-md hover:bg-gray-700"
          >
            <X className="size-5 text-white" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="p-3 grid gap-2">
          {items.map(({ Icon, label, href }) => (
            <NavLink
              key={label}
              to={href}
              onClick={() => setCollapsed(false)} // auto-close after click
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-gray-300 hover:bg-primary hover:text-primary-foreground",
                  isActive && "bg-primary text-primary-foreground"
                )
              }
            >
              <Icon className="size-5" />
              <span>{label}</span>
            </NavLink>
          ))}
          <hr />
          <NavLink
            key={"Profile"}
            to={"/profile"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-gray-300 hover:bg-primary hover:text-primary-foreground",
                isActive && "bg-primary text-primary-foreground"
              )
            }
            aria-label={"Profile"}
          >
            <User className="size-5" />
            <span>Profile</span>
          </NavLink>
            <div className="my-4 px-4 w-full items-center gap-1 cursor-pointer">
            {/* <div className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-300 hover:bg-primary hover:text-primary-foreground"> */}
              <Button
                variant="default"
                aria-label="Sign in"
                onClick={handleLogout}
                className="w-full"
              >
                Logout
              </Button>
            </div>
        </nav>
      </div>
    </>
  );
}
