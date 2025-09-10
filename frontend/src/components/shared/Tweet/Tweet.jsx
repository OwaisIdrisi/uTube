import React, { useState } from "react";
import { Avatar, AvatarImage } from "../../ui/avatar";
import { Heart, MessageCircle, Edit, Trash } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { editTweet, removeTweet } from "@/features/appFeature/tweetFeature";
import { Like } from "@/utils/Like";
import moment from "moment";
import { Link } from "react-router-dom";

const Tweet = ({ tweet }) => {
  let { _id, content, owner } = tweet;
  const user = useSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState(content);
  const contentRef = React.useRef();
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleEdit = () => {
    setIsEditing((prev) => !prev);
    setEditedContent(content);
    if (!isEditing) return;
    editTweet(tweet, {
      editedContent,
      isEditing,
      contentRef,
      setIsEditing,
      setEditedContent,
    });
  };

  const handleDelete = () => removeTweet(_id);

  const handleLike = () => {
    // Implement like functionality
    console.log("Like clicked");
  };

  // useEffect(() => {
  //   setEditedContent(content);
  //   console.log(content);
  // }, [content]);

  return (
    <div className="flex gap-3 shadow border md:w-3/4 lg:w-1/3 h-full my-3 py-4 rounded mx-3 px-2">
      <div className="left flex-shrink-0 ">
        <Avatar className=" p-2 size-10 rounded-full border border-gray-300">
          <AvatarImage src={owner?.avatar} />
        </Avatar>
      </div>
      <div className="right flex flex-col gap-3">
        <Link to={`/tweet/${_id}`} className="tweet-area text-black">
          <div className="flex gap-1">
            <span className="text-black font-bold">{owner.fullName}</span>
            <span className="mr-3 text-gray-600">@{owner.username}</span>
            <span className="text-gray-600">
              {moment(tweet.createdAt).fromNow()}
            </span>
          </div>
          {isEditing ? (
            <Textarea
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={3}
              resizable={"false"}
            />
          ) : (
            <div className="content mt-2" ref={contentRef}>
              {content.length < 100 ? (
                content
              ) : (
                <p>
                  {content.slice(0, 100)}
                  ...{" "}
                  <span className="text-blue-500 cursor-pointer">
                    Read More
                  </span>
                </p>
              )}
            </div>
          )}
        </Link>
        <div className="btns flex gap-4 w-full">
          <button
            className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors 
              hover:text-sky-300 active:scale-95"
          >
            <MessageCircle />
            <span>4</span>
          </button>

          <Like
            _id={_id}
            user={user}
            likes={likes}
            setLikes={setLikes}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            onToggle={handleLike}
            type="tweet"
          />
          {/* <button
            onClick={handleLike}
            className="flex items-center space-x-2 px-2 py-2 rounded-lg transition-colors 
              hover:text-primary active:scale-95"
          >
            <Heart />
            <span>6</span>
          </button> */}
        </div>
        {user._id === owner._id && (
          <div className="btns flex p-2 rounded-lg w-full gap-3 ">
            <Button
              onClick={handleEdit}
              variant="outline"
              className="cursor-pointer hover:text-sky-500"
            >
              <Edit />
              <span>{isEditing ? "Save" : "Edit"}</span>
            </Button>
            <Button
              onClick={handleDelete}
              className="cursor-pointer hover:text-sky-500"
            >
              <Trash />
              <span>Delete</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tweet;
