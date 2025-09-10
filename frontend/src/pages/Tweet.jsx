import { getTweetDetails } from "@/api/tweet";
import Comment from "@/components/shared/Comment/Comment";
import { Like } from "@/utils/Like";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Tweet = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const user = useSelector((state) => state.auth.user);
  const [isLiked, setIsLiked] = useState(data?.likes?.isLiked || false);
  // const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(data?.likes?.likes || 0);

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        const response = await getTweetDetails(id);
        if (response.success) {
          setData({
            tweet: response?.data?.tweet,
            likes: response?.data?.likes,
            comments: response?.data?.comment,
          });

          setLikeCount(data?.likes?.likes);
          setIsLiked(data?.likes?.isLiked);
        }
        console.log(response?.data);
        console.log(response.data.comment);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTweet();
  }, [id]);

  return (
    <div className="max-w-2xl md:mx-auto border border-gray-200 bg-white hover:bg-gray-50 transition-colors rounded-lg shadow-sm mx-3 my-5">
      {/* Tweet Header */}
      <div className="flex items-start space-x-3 p-4">
        <img
          src={data?.tweet?.owner?.avatar}
          alt={data?.tweet?.owner?.fullName}
          className="w-12 h-12 rounded-full hover:opacity-90 cursor-pointer"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <h3 className="font-bold text-black hover:underline cursor-pointer truncate">
              {data?.tweet?.owner?.fullName}
            </h3>
            <span className="text-gray-500">
              @{data?.tweet?.owner?.username}
            </span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">
              {moment(data?.tweet?.createdAt).fromNow()}
            </span>
            <div className="ml-auto">
              <button className="text-gray-400 hover:bg-gray-100 rounded-full p-2">
                ⋯
              </button>
            </div>
          </div>

          {/* data Content */}
          <div className="mt-1">
            <p className="text-black text-[15px] leading-5">
              {data?.tweet?.content}
            </p>
          </div>

          {/* comments count */}
          <div className="flex items-center justify-between max-w-md mt-3">
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full px-3 py-2 transition-colors group">
              <span className="group-hover:bg-blue-100 rounded-full p-2">
                💬
              </span>
              <span className="text-sm">{data?.comments?.length}</span>
            </button>

            {/* <button
              onClick={handleLike}
              className={`flex items-center space-x-2 hover:bg-red-50 rounded-full px-3 py-2 transition-colors group ${
                isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              }`}
            >
              <span className="group-hover:bg-red-100 rounded-full p-2">
                {isLiked ? "❤️" : "🤍"}
              </span>
             
              <span className="text-sm">{likeCount}</span>
            </button> */}
            <Like
              _id={data?.tweet?._id}
              isLiked={isLiked}
              likes={likeCount}
              setIsLiked={setIsLiked}
              setLikes={setLikeCount}
              type="tweet"
              user={user}
              key={data?.tweet?._id}
            />
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <Comment id={id} type="tweet" key={id} />
    </div>
  );
};

export default Tweet;
