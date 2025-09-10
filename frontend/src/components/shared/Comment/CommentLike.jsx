import { Like } from "@/utils/Like";
import React, { useState } from "react";

const CommentLike = ({ comment, user }) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const onToggle = () => {};

  return (
    <Like
      _id={comment._id}
      onToggle={onToggle}
      isLiked={isLiked}
      setIsLiked={setIsLiked}
      likes={likes}
      setLikes={setLikes}
      user={user}
      type="comment"
    />
  );
};

export default CommentLike;
