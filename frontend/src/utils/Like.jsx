import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { ThumbsUp, ThumbsUp as ThumbsUpFilled } from "lucide-react";
import { getCommentLikes, getTweetLikes, getVideoLikes } from "@/api/like";
// import { useSelector } from "react-redux";
import { toggleLike } from "@/features/appFeature/likeFeature";

export const Like = ({
  _id,
  user,
  likes,
  setLikes,
  isLiked,
  setIsLiked,
  type,
  // liked = false,
}) => {
  // const [likes, setLikes] = useState(0); // This should ideally come from props or state
  // const [isLiked, setIsLiked] = useState(liked);
  // const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchInitialLikes = async () => {
      try {
        let response;
        switch (type) {
          case "video":
            response = await getVideoLikes(_id);
            break;
          case "tweet":
            response = await getTweetLikes(_id);
            break;
          case "comment":
            response = await getCommentLikes(_id);
            break;
          default:
            response = await getVideoLikes(_id);
        }
        setIsLiked(response?.data?.isLiked);
        setLikes(response?.data?.likes || 0);
      } catch (error) {
        console.error("Error fetching video likes:", error);
      }
    };
    fetchInitialLikes();
  }, [_id, user._id, setIsLiked, setLikes, type]);

  // const handleToggle = async () => {
  //   try {
  //     const response = await toggleVideoLike(_id);
  //     console.log(response);
  //     if (response.success) {
  //       setIsLiked((prev) => !prev);
  //       setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  //       toast.success(isLiked ? "Like removed" : "Video liked");
  //     }
  //   } catch (error) {
  //     toast.error("Failed to toggle like");
  //     console.error("Error toggling like:", error);
  //   }
  // };
  const handleToggle = async () => {
    await toggleLike(type, _id, setIsLiked, setLikes, isLiked);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={isLiked}
      aria-label={isLiked ? "Unlike" : "Like"}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors 
                 hover:bg-gray-100 active:scale-95"
    >
      <ThumbsUp
        size={22}
        className={`transition-colors duration-200 ${
          isLiked ? "text-primary fill-primary" : "text-gray-600"
        }`}
      />
      <span className="text-sm font-medium text-gray-700">{likes}</span>
    </button>
  );
};

// export const handleToggle = async (func, _id,setIsLiked,setLikes,isLiked) => {
//   try {
//     const response = await func(_id);
//     console.log(response);
//     if (response.success) {
//       setIsLiked((prev) => !prev);
//         setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
//         toast.success(isLiked ? "Like removed" : "Video liked");
//       }
//     } catch (error) {
//       toast.error("Failed to toggle like");
//       console.error("Error toggling like:", error);
//     }
//   };
