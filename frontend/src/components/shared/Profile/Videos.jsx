import { getUserVideos } from "@/api/utils";
import { deleteVideo } from "@/api/video";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import VideoCard from "../Video/VideoCard";

const Videos = ({setOpen}) => {
  const [userVideos, setUserVideos] = useState([]);
useEffect(() => {
    // const fetchUserProfile = async () => {
    //   // Fetch user profile logic here if needed
    // };
    const fetchUserVideos = async () => {
      const response = await getUserVideos();
      setUserVideos(response.data);
    };
    fetchUserVideos();
  }, []);
    const editHandler = (videoId) => {
    console.log("Edit video:", videoId);
    alert("Edit functionality coming soon!");
  };
  const deleteHandler = async (videoId) => {
    console.log("Delete video:", videoId);
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const response = await deleteVideo(videoId);
      if (!response.success) throw new Error("Failed to delete video");
      setUserVideos((prev) => prev.filter((video) => video._id !== videoId));
      toast.success("Video deleted successfully");
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    }
  };
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">My Videos</h2>
                  <Button onClick={() => setOpen(true)}>
                    <Upload className="mr-2 size-4" />
                    Upload Video
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {userVideos.length === 0 ? (
                    <p className="text-center text-2xl text-muted-foreground  ">
                      No videos found
                    </p>
                  ) : (
                    <>
                      {userVideos.map((video) => (
                        <div className="shadow p-4" key={video._id}>
                          <VideoCard video={video} />
                          {/* edit and delete button for video */}
                          <div className="mt-3 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 hover:bg-primary hover:text-white cursor-pointer"
                              onClick={() => editHandler(video._id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 hover:bg-primary hover:text-white cursor-pointer"
                              onClick={() => deleteHandler(video._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
  </>)
};

export default Videos;
