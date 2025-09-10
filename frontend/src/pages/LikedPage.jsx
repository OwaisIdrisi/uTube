import { getLikedVideos } from "@/api/like";
import VideoCard from "@/components/shared/Video/VideoCard";
import React, { useEffect, useState } from "react";

const LikedPage = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const response = await getLikedVideos();
        console.log(response.data);
        setLikedVideos(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLikedVideos();
  }, []);
  return (
    <div>
      <h1>Liked Videos: </h1>
      <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-3">
        {likedVideos.map((v) => (
          <VideoCard video={v.video} key={v.video._id} />
        ))}
      </div>
    </div>
  );
};

export default LikedPage;
