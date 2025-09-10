import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const Playlist = () => {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Playlists</h2>
        <Button variant="outline">Create Playlist</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Mock playlists */}
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              <img
                src="/playlist-thumbnail.png"
                alt={`Playlist ${i + 1} thumbnail`}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs text-white">
                {Math.floor(Math.random() * 20) + 5} videos
              </div>
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium">Tech Tutorial Series #{i + 1}</h3>
              <p className="text-sm text-muted-foreground">
                Updated 2 days ago
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Playlist;
