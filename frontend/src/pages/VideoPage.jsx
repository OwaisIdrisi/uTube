import { VideoPlayer } from "@/components/shared/Video/VideoPlayer";
// import { SubscribeButton } from "@/components/youtube/subscribe-button";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getVideoById, increamentView } from "@/api/video";
import { toggleSubscription } from "@/api/subscription";
import { toast } from "sonner";
import Comment from "@/components/shared/Comment/Comment";
import { Like } from "@/utils/Like";
import { useSelector } from "react-redux";
import moment from "moment";

export default function VideoPage() {
  const params = useParams();
  const user = useSelector((state) => state.auth.user);
  const [video, setVideo] = useState({
    id: "",
    title: "",
    channel: "",
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const related = [];
  // mockVideos.filter((v) => v.id !== video.id).slice(0, 12) || [];

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchVideoById = async (id) => {
      try {
        const response = await getVideoById(id);
        setVideo(response.data);
        setIsSubscribed(response.data.owner?.isSubscribed || false);
      } catch (error) {
        toast.error("Failed to fetch video data");
        console.error("Error fetching video:", error);
      }
    };

    const increaseViewCount = async () => {
      try {
        const response = await increamentView(params.id);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    if (params.id) {
      fetchVideoById(params.id);
      increaseViewCount();
    }
  }, [params.id, isSubscribed]);

  const handleSubscribe = async () => {
    try {
      const response = await toggleSubscription(video.owner?._id);
      if (response.success) {
        setIsSubscribed(!isSubscribed);
        toast.success(isSubscribed ? "Unsubscribed" : "Subscribed");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Error toggling subscription";
      toast.error(message);
      console.error("Subscription error:", error);
    }
  };

  const onToggle = () => {};

  return (
    <main className="min-h-dvh">
      <div className="mx-auto flex">
        <div className="min-w-0 flex-1 p-3 sm:p-4">
          <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
            {/* Player + Details */}
            <section aria-label="Player and details" className="min-w-0">
              <VideoPlayer src={video?.videoFile} title={video.title} />

              <h1 className="mt-3 text-pretty text-xl font-semibold leading-tight sm:text-2xl">
                {video.title}
              </h1>

              <div>
                {video._id && (
                  <Like
                    _id={video._id}
                    onToggle={onToggle}
                    isLiked={isLiked}
                    setIsLiked={setIsLiked}
                    likes={likes}
                    setLikes={setLikes}
                    user={user}
                    type="video"
                  />
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/channel/${video.owner?._id}`}
                    className="relative size-10 overflow-hidden rounded-full hover:opacity-80"
                  >
                    <img
                      src={video.owner?.avatar || `/vite.svg`}
                      alt={`${video.owner?.username} avatar`}
                      className="object-cover"
                    />
                  </Link>
                  <div>
                    <Link
                      to={`/channel/${video.owner?.username}`}
                      className="hover:text-primary"
                    >
                      <p className="font-medium leading-tight hover:text-primary">
                        {video.owner?.username}
                      </p>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {video.owner?.subscribersCount || 0} subscribers
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleSubscribe}
                  variant={"default"}
                  disabled={user._id === video.owner?._id}
                >
                  {isSubscribed ? "Unsubscribe" : "Subscribe"}
                </Button>
                {/* // channelId={getChannelId(video.channel)}
                  // channelName={video.channel}
                  // initialSubscribed={false}
                  size="sm" */}
                <div className="ml-auto text-sm text-muted-foreground">
                  {video.views} Views • {moment(video.createdAt).fromNow()}
                </div>
              </div>
              <div className="mt-4 rounded-lg border p-3 text-sm leading-6">
                <p className="text-pretty">
                  {video.description || "No description available."}
                </p>
              </div>
            </section>

            {/* Related */}
            <aside aria-label="Related videos" className="grid gap-3">
              {related.map((rv) => (
                <div key={rv.id} className="grid grid-cols-[168px,1fr] gap-3">
                  <div className="relative aspect-video overflow-hidden rounded-md">
                    <img
                      src={`/placeholder.svg?height=720&width=1280&query=video%20thumbnail`}
                      alt={`${rv.title} thumbnail`}
                      fill
                      sizes="168px"
                      className="object-cover"
                    />
                    <Link
                      href={`/watch/${rv.id}`}
                      className="absolute inset-0"
                      aria-label={`Watch ${rv.title}`}
                    />
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/watch/${rv.id}`}
                      className="hover:text-primary"
                    >
                      <h3 className="line-clamp-2 font-medium leading-tight">
                        {rv.title}
                      </h3>
                    </Link>
                    <Link
                      href={`/channel/${rv.channel}`}
                      className="hover:text-primary"
                    >
                      <p className="text-sm text-muted-foreground hover:text-foreground">
                        {rv.channel}
                      </p>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {rv.views} • {rv.uploaded}
                    </p>
                  </div>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </div>
      <hr />
      <div className="mt-8 px-3 sm:px-4 lg:px-0 lg:mx-auto lg:max-w-5xl">
        {video._id && <Comment id={video._id} type="video" />}
      </div>
    </main>
  );
}
