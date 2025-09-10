import { Button } from "@/components/ui/button";
import { Avatar } from "@radix-ui/react-avatar";
import { Edit, Eye, Settings, Users } from "lucide-react";
import React from "react";

const Header = ({ user }) => {
  return (
    <div className="relative mb-6 overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative size-24 overflow-hidden rounded-full border-4 border-white/20">
          <Avatar className="size-24  w-full h-full">
            <img
              src={user.avatar || "/vite.svg"}
              alt={`${user.username} avatar`}
              className="object-cover"
            />
          </Avatar>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold sm:text-3xl">{user.fullName}</h1>
          </div>
          <p className="text-white/80">@{user.username}</p>
          <p className="mt-2 text-sm text-white/90">{user.bio}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Users className="size-4" />
              {user.subscribers || 0} subscribers
            </span>
            <span className="flex items-center gap-1">
              <Eye className="size-4" />
              {user.totalViews} views
            </span>
            <span>{user.videosCount || 0} videos</span>
            <span>Joined {user.joinDate || "Unknown"}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Edit className="mr-2 size-4" />
            Edit Profile
          </Button>
          <Button variant="secondary" size="sm">
            <Settings className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
