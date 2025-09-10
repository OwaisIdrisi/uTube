
export const mockVideos = Array.from({ length: 5 }).map((_, i) => ({
    id: String(i + 1),
    title: `Amazing Video Title ${i + 1}: Tips, Tricks, and More`,
    channel: `Channel ${(i % 6) + 1}`,
    views: `${(Math.floor(Math.random() * 900) + 100).toLocaleString()}K views`,
    uploaded: `${Math.floor(Math.random() * 11) + 1} months ago`,
    duration: `${Math.floor(Math.random() * 9) + 1}:${String(Math.floor(Math.random() * 59)).padStart(2, "0")}`,
}))
