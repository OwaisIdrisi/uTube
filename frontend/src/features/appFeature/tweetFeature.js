import { deleteTweet, updateTweet } from "@/api/tweet";
import { toast } from "sonner";

export const editTweet = async (tweet, { editedContent, isEditing, contentRef, setIsEditing, setEditedContent }) => {
    try {
        console.log(editedContent);
        if (isEditing) {
            const response = await updateTweet(tweet._id, { content: editedContent });
            console.log(response.data);
            setIsEditing(false);
            setEditedContent("");
            contentRef.current.textContent = editedContent;
            tweet.content = editedContent;
            console.log(tweet);
            toast.success("Tweet updated successfully");
        }
    } catch (error) {
        const message = error?.response?.data?.message || "Something went wrong";
        toast.error(message);
        console.error("Error editing tweet:", error);
    }
    // try {
    //     const response = await updateTweet(_id, data);
    //     if (response?.success) {
    //         toast.success("Tweet updated successfully");
    //     }
    // } catch (error) {
    //     const message = error?.response?.data?.message || "Something went wrong";
    //     toast.error(message);
    //     console.error("Error updating tweet:", error);
    // }
};

export const removeTweet = async (_id) => {
    try {
        const response = await deleteTweet(_id);
        if (response?.success) {
            toast.success("Tweet deleted successfully");
        }
    } catch (error) {
        const message = error?.response?.data?.message || "Something went wrong";
        toast.error(message);
        console.error("Error deleting tweet:", error);
    }
};