import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { getChannelVideos, getUserChannelProfile } from "@/api/utils";
import { toggleSubscription } from "@/api/subscription";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import VideoCard from "@/components/shared/Video/VideoCard";

const ChannelPage = () => {
  const { username } = useParams();
  console.log(username);
  const user = useSelector((state) => state.auth.user);
  const [channel, setChannel] = useState({});
  const [channelVideos, setChannelVideos] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchChannelProfile = async () => {
      try {
        const response = await getUserChannelProfile(username);
        console.log(response);
        setChannel(response.data);
      } catch (error) {
        if (error.status === 404) {
          toast.error("Channel not found");
          setError("Channel not found");
          return;
        }
        console.error("Error fetching channel profile:", error);
      }
    };
    const fetchChannelVideos = async () => {
      try {
        const response = await getChannelVideos(channel._id);
        console.log(response.data);
        setChannelVideos(response.data);
      } catch (error) {
        const message =
          error?.response?.data?.message || "Failed to fetch channel videos";
        toast.error(message);
        console.log(error);
      }
    };

    fetchChannelProfile();
    if (channel._id) fetchChannelVideos();
  }, [username, channel._id]);

  const handleSubscribe = async () => {
    try {
      const response = await toggleSubscription(channel._id);
      if (response.success) {
        setChannel((prev) => ({
          ...prev,
          isSubscribed: !prev.isSubscribed,
        }));
        toast.success(channel.isSubscribed ? "Unsubscribed" : "subscribed");
      }
      console.log(response);
    } catch (error) {
      const message = error?.response?.data?.message || "subscribe Failed";
      toast.error(message);
      console.log(error);
    }
  };

  const handleEditChannel = () => {
    // Navigate to edit channel page or open edit modal
    console.log("Edit channel");
    alert("Edit channel functionality coming soon!");
  };

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold">404</h2>
        <p className="text-sm text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Cover Image */}
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-6 overflow-hidden">
        {channel.coverImage ? (
          <img
            src={channel.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Cover Image
          </div>
        )}
      </div>

      {/* Channel Info */}
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={channel.avatar} alt={channel.username} />
              <AvatarFallback>
                {channel.fullName ? channel.fullName[0].toUpperCase() : "C"}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-2xl font-semibold">{channel.fullName}</h2>
              <p className="text-sm text-gray-500">@{channel.username}</p>
              <p className="text-sm text-gray-600">
                {channel.subscribersCount} subscribers •{" "}
                {channel.channelSubscriberTo} subscribed
              </p>
            </div>
          </div>

          <div>
            {channel._id === user._id ? (
              <Button variant="default" onClick={handleEditChannel}>
                Edit Channel
              </Button>
            ) : (
              <Button onClick={handleSubscribe} variant="default">
                {channel.isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* channel videos */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Videos</h3>
        {/* Render channel videos here */}
        {/* <p>{channel.videos?.length ? channel.videos.map(video => (
          <div key={video._id}>
            <h4 className="font-semibold">{video.title}</h4>
            <p className="text-sm text-gray-600">{video.description}</p>
          </div>
        )) : "No videos available"}</p> */}
        {channelVideos?.length
          ? channelVideos.map((video) => (
              <div key={video._id}>
                <VideoCard video={video} />
              </div>
            ))
          : "No videos available"}
      </div>
    </div>
  );
};

export default ChannelPage;
