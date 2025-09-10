import { createComment, deleteComment, editComment, getComments } from "@/api/comment";
import { toast } from "sonner";

export const addComment = async (type, id, user, commentText, setCommentText) => {
    if (!commentText.trim()) return;
    try {
        const response = await createComment(id, type, commentText);
        const data = response.data.comment;
        const newComment = {
            owner: {
                username: user?.username,
                avatar: user?.avatar,
            },
            content: data?.content,
            _id: data?._id,
            createdAt: data?.createdAt,
        };
        // setComments((prev) => [...prev, newComment]);
        toast.success("Comment added");
        setCommentText("");
        return newComment
    } catch (error) {
        toast.error("Failed to add comment");
        console.log(error);
    }
};

export const updateComment = async (type, comment, setComments, editCommentState, setEditCommentState) => {
    // Implement edit functionality
    //  if edit button is clicked then it first go to else part and set the editCommentState
    // then when save button is clicked it goes to if part and make api call to edit the comment    
    try {
        if (editCommentState) {
            const response = await editComment(
                comment._id,
                editCommentState.content
            );
            console.log(response.data);
            setComments((prevComments) =>
                prevComments.map((c) =>
                    c._id === comment._id
                        ? { ...c, content: editCommentState.content }
                        : c
                )
            );
            toast.success("Comment edited");
            setEditCommentState(null);
        } else {
            setEditCommentState({ _id: comment._id, content: comment.content });
        }

    } catch (error) {
        console.log(error);
    }
};
export const destroyComment = async (type, commentId, setComments) => {
    // Implement delete functionality
    try {
        console.log("Delete comment:", commentId);
        const response = await deleteComment(commentId);
        console.log(response);
        setComments((prevComments) =>
            prevComments.filter((c) => c._id !== commentId)
        );
        toast.success("Comment deleted");
    } catch (error) {
        toast.error("Failed to delete comment");
        console.log(error);
    }
};

export const fetchComments = async (type, id, setComments) => {
    try {
        let response;
        if (type === "tweet") {
            response = await getComments(id, "tweet");
            console.log(response);

        } else if (type === "video") {
            response = await getComments(id, "video");
            console.log(response);
        }
        setComments(response.data.comments);
    } catch (error) {
        console.log(error);
    }
};