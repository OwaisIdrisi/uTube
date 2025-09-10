import { cn } from "@/lib/utils";
import moment from "moment";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function VideoCard({ video, className }) {
  const { _id, title, owner, views, createdAt, duration, thumbnail } = video;
  const user = useSelector((state) => state.auth.user);
  return (
    <Link
      to={`/video/${_id}`}
      aria-label={`Watch ${title}`}
      className={cn(
        "flex flex-col shadow px-1 py-3 hover:transform hover:scale-105 transition-transform",
        className
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        {/* Placeholder thumbnail */}
        <img
          src={thumbnail || `/anime-moon-landscape_23-2151645908.jpg`}
          alt={`${title} thumbnail`}
          // fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          // priority=  {false}
        />
        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-xs text-white">
          {parseFloat(duration).toFixed(0)} min
        </span>
        {/* <Link
          href={`/watch/${_id}`}
          className="absolute inset-0"
          aria-label={`Watch ${title}`}
        /> */}
      </div>
      <div className="mt-2 flex gap-3">
        {/* Channel avatar placeholder */}
        <div className="relative size-10 overflow-hidden rounded-full mx-2 flex-shrink-0">
          <img
            src={
              owner?.avatar || (owner === user._id ? user.avatar : `/vite.svg`)
            }
            alt={`${owner} avatar`}
            // fill
            className="object-cover size-10"
          />
        </div>
        <div className="min-w-0">
          <h3 className="line-clamp-2 font-medium leading-tight text-pretty">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground font-bold">
            {owner.username}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span> {views} views • </span>
            <span>{moment(createdAt).fromNow()}</span>
            {/* {createdAt.split(" ")[1]} */}
          </p>
        </div>
      </div>
    </Link>
  );
}
