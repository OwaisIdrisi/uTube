import { VideoGrid } from "@/components/shared/Video/VideoGrid";
// import { mockVideos } from "@/lib/videos";

export default function Home() {
  return (
    <div className="min-w-0 flex-1">
      {/* <CategoryPills /> */}
      {/* <VideoGrid videos={mockVideos} /> */}
      <VideoGrid />
    </div>
  );
}
