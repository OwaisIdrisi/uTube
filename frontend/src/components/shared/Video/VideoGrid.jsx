import { useEffect } from "react";
import VideoCard from "./VideoCard";
import { getAllVideos } from "@/api/video";
import { useDispatch, useSelector } from "react-redux";
import { setVideos, setError, setLoading } from "@/features/VideoSlice";

export function VideoGrid() {
  const { videos, loading, error } = useSelector((state) => state.video);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVideos = async () => {
      dispatch(setLoading(true));
      try {
        const response = await getAllVideos();
        dispatch(setVideos(response?.data?.videos));
      } catch (error) {
        let message = "Failed to fetch videos";
        console.log(error);
        dispatch(setError(message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchVideos();
  }, [dispatch]);

  if (loading)
    return <div className="text-center text-2xl py-6">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-2xl py-6">Error loading videos</div>
    );

  if (videos.length === 0) {
    return <div className="text-center text-2xl py-6">No videos found</div>;
  }

  return (
    <section
      aria-label="Video results"
      className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-3"
    >
      {videos?.map((v) => (
        <VideoCard key={v._id} video={v} />
      ))}
    </section>
  );
}
