import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Avatar } from "../../ui/avatar";
import { useSelector } from "react-redux";
// import { editComment } from "@/api/comment";
import moment from "moment";
import {
  addComment,
  destroyComment,
  fetchComments,
  updateComment,
} from "@/features/appFeature/commentFeature";
import { Like } from "@/utils/Like";
import CommentLike from "./CommentLike";

// const Comment = ({ id, type }) => {
//   const user = useSelector((state) => state.auth.user);
//   const [comments, setComments] = useState([]);
//   const [commentText, setCommentText] = useState("");
//   // const [isEdit, setIsEdit] = useState(false);
//   const [editCommentState, setEditCommentState] = useState(null);

//   useEffect(() => {
//     fetchComments(type, id, setComments);
//   }, [id, type]);

//   // comment logic
//   // feature/appFeature/commentFeature
//   const handleAddComment = async () => {
//     const newComment = await addComment(
//       type,
//       id,
//       user,
//       commentText,
//       setCommentText,
//       setComments
//     );
//     if (!newComment) return;
//     setComments((prev) => [...prev, newComment]);
//   };

//   const handleEdit = async (comment) => {
//     await updateComment(
//       type,
//       comment,
//       setComments,
//       editCommentState,
//       setEditCommentState
//     );
//   };

//   const handleDelete = (commentId) => {
//     destroyComment(type, commentId, setComments);
//   };

//   return (
//     <div className="max-w-2xl mx-auto border border-gray-200 bg-white p-4 hover:bg-gray-50 transition-colors">
//       <h3 className="text-lg font-medium mb-4">Add a Comment</h3>
//       <textarea
//         placeholder="Add a comment..."
//         className="w-full border p-2"
//         value={commentText}
//         onChange={(e) => setCommentText(e.target.value)}
//       />
//       <Button
//         onClick={handleAddComment}
//         variant={"default"}
//         className="mt-2 cursor-pointer hover:bg-muted-foreground"
//       >
//         Submit
//       </Button>
//       <div className="mt-4">
//         <h4 className="font-semibold">Comments</h4>
//         {comments?.length === 0 ? (
//           <p className="text-xl">No comments yet. Be the first to comment!</p>
//         ) : (
//           <ul>
//             {comments?.map((comment) => (
//               <li key={comment._id} className="mb-4 shadow-sm p-2 rounded">
//                 <div className="border-b py-2 flex items-center gap-3">
//                   <Avatar>
//                     <img src={comment?.owner?.avatar} alt="User Avatar" />
//                   </Avatar>
//                   <span className="ml-2 font-medium">
//                     {comment?.owner?.username} :
//                   </span>
//                   {editCommentState && comment._id === editCommentState._id ? (
//                     <textarea
//                       className="w-full border p-2"
//                       value={editCommentState.content}
//                       onChange={(e) =>
//                         setEditCommentState({
//                           ...editCommentState,
//                           content: e.target.value,
//                         })
//                       }
//                     />
//                   ) : (
//                     <div>{comment.content}</div>
//                   )}

//                   <span className="text-sm text-muted-foreground ml-auto">
//                     {moment(comment?.createdAt).fromNow()}
//                   </span>
//                 </div>
//                 {/* if user is the owner of the comment, show edit and delete options */}
//                 {user?._id === comment?.owner?._id && (
//                   <div className="flex gap-2 mt-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="cursor-pointer hover:bg-muted-foreground hover:text-white"
//                       onClick={() => handleEdit(comment)}
//                     >
//                       {editCommentState && editCommentState._id === comment._id
//                         ? "Save"
//                         : "Edit"}
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="text-red-500 cursor-pointer hover:bg-red-500 hover:text-white"
//                       onClick={() => handleDelete(comment._id)}
//                     >
//                       Delete
//                     </Button>
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

const Comment = ({ id, type }) => {
  const user = useSelector((state) => state.auth.user);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editCommentState, setEditCommentState] = useState(null);
  useEffect(() => {
    fetchComments(type, id, setComments);
  }, [id, type]);

  // comment logic
  // feature/appFeature/commentFeature
  const handleAddComment = async () => {
    const newComment = await addComment(
      type,
      id,
      user,
      commentText,
      setCommentText,
      setComments
    );
    if (!newComment) return;
    setComments((prev) => [...prev, newComment]);
  };

  const handleEdit = async (comment) => {
    await updateComment(
      type,
      comment,
      setComments,
      editCommentState,
      setEditCommentState
    );
  };

  const handleDelete = (commentId) => {
    destroyComment(type, commentId, setComments);
  };

  return (
    <div className="max-w-2xl mx-auto border border-gray-200 bg-white p-4 hover:bg-gray-50 transition-colors">
      <h3 className="text-lg font-medium mb-4">Add a Comment</h3>
      <textarea
        placeholder="Add a comment..."
        className="w-full border p-2"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <Button
        onClick={handleAddComment}
        variant={"default"}
        className="mt-2 cursor-pointer hover:bg-muted-foreground"
      >
        Submit
      </Button>
      <div className="mt-4">
        <h4 className="font-semibold">Comments</h4>
        {comments?.length === 0 ? (
          <p className="text-xl">No comments yet. Be the first to comment!</p>
        ) : (
          <ul className="border-t border-gray-100">
            {comments?.map((comment, index) => (
              <li
                key={index}
                className="flex space-x-3 p-4 border-b border-gray-100 hover:bg-gray-50"
              >
                <img
                  src={comment.owner.avatar}
                  alt={comment.owner.fullName}
                  className="w-8 h-8 rounded-full hover:opacity-90 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-black hover:underline cursor-pointer text-sm">
                      {comment.owner.fullName}
                    </span>
                    <span className="text-gray-500 text-sm">
                      @{comment.owner.username}
                    </span>
                    <span className="text-gray-500 text-sm ml-3">
                      {moment(comment.createdAt).fromNow()}
                    </span>
                  </div>
                  {/* <p className="mt-1 text-black text-sm">{comment.content}</p> */}
                  {editCommentState && comment._id === editCommentState._id ? (
                    <textarea
                      className="w-full border p-2"
                      value={editCommentState.content}
                      onChange={(e) =>
                        setEditCommentState({
                          ...editCommentState,
                          content: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="mt-1 text-black text-sm">{comment.content}</p>
                  )}
                  <div className="flex items-center space-x-6 mt-2">
                    <CommentLike comment={comment} user={user} />
                    {/* <button className="text-gray-400 hover:text-blue-500 text-sm">
                      💬
                    </button> */}
                  </div>
                </div>

                {user?._id === comment?.owner?._id && (
                  <div className="flex flex-col md:flex-row gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer hover:bg-muted-foreground hover:text-white"
                      onClick={() => handleEdit(comment)}
                    >
                      {editCommentState && editCommentState._id === comment._id
                        ? "Save"
                        : "Edit"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 cursor-pointer hover:bg-red-500 hover:text-white"
                      onClick={() => handleDelete(comment._id)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Comment;
