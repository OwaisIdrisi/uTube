import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Menu, Search, Mic, Bell, User, SquarePlay } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/api/auth";
import { logoutState, SetError } from "@/features/authSlice";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { toast } from "sonner";

const Navbar = ({ className, setCollapsed, setMobileOpen }) => {
  // const [q, setQ] = useState(defaultQuery)
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const toggle = () => {
    setMobileOpen((prev) => !prev);
    setCollapsed((prev) => !prev);
  };
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
  };
  return (
    <header
      className={cn(
        "w-full sticky top-0 z-40 border-b bg-background",
        className
      )}
      role="banner"
      aria-label="Top navigation"
    >
      <div className="mx-auto flex h-14 items-center gap-2 px-3 sm:px-4">
        <div className="flex items-center gap-2" onClick={toggle}>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle menu"
            className="cursor-pointer"
          >
            <Menu className="size-5" />
          </Button>
          <Link
            to="/"
            className="flex items-center gap-1"
            aria-label="Go to home"
          >
            <SquarePlay className="size-8 text-primary" aria-hidden />
            <span className="font-semibold tracking-tight text-xl">uTube</span>
          </Link>
        </div>

        <form className="ml-auto flex w-full max-w-2xl items-center gap-2">
          <div className="flex w-full items-center rounded-md border">
            <Input
              // value={q}
              // onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              aria-label="Search videos"
              className="border-0 focus-visible:ring-0"
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              aria-label="Submit search"
              className="rounded-l-none border-l"
            >
              <Search className="size-5" />
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Voice search"
            className="hidden md:block"
          >
            <Mic className="size-5" />
          </Button>
        </form>
        {user ? (
          <>
            {/* <Link
              to={`/profile/${user._id}`}
              className="ml-1 hidden items-center gap-1 sm:flex cursor-pointer"
            >
              
              <Avatar
                src={user.avatar || "/vite.svg"}
                alt={user.username}
                className="h-8 w-8 rounded-full"
              />
            </Link>
             */}
            <Avatar className="cursor-pointer flex justify-center items-center bg-slate-200">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                <User className="size-6" />
              </AvatarFallback>
            </Avatar>
            <div className="ml-1 hidden items-center gap-1 sm:flex cursor-pointer">
              <Button
                variant="default"
                aria-label="Sign in"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </>
        ) : (
          <Link
            to="/login"
            className="ml-1 hidden items-center gap-1 sm:flex cursor-pointer"
          >
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="size-5" />
            </Button>
            <Button variant="default" aria-label="Sign in">
              <User className="mr-2 size-4" />
              Sign in
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
