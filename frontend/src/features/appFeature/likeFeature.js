import { toast } from "sonner";
import { toggleCommentLike, toggleTweetLike, toggleVideoLike } from "@/api/like";

export const toggleLike = async (type, _id, setIsLiked, setLikes, isLiked) => {
    let response
    switch (type) {
        case "video":
            response = await toggleVideoLike(_id);
            break;
        case "tweet":
            response = await toggleTweetLike(_id);

            break;
        case "comment":
            response = await toggleCommentLike(_id);
            break;
    }
    try {
        console.log(response);
        if (response.success) {
            setIsLiked((prev) => !prev);
            setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
            toast.success(isLiked ? "Like removed" : `${type} liked`);
        }
    } catch (error) {
        toast.error("Failed to toggle like");
        console.error("Error toggling like:", error);
    }
};

