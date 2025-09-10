import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "@/components/ui/textarea";
import { createTweet } from "@/api/tweet";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const CreateTweet = ({ setTweets }) => {
  const user = useSelector((state) => state.auth.user);
  const [content, setContent] = React.useState("");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) setContent("");
  }, [open]);

  const handleTweetCreate = async () => {
    if (!content || content.length < 20) {
      toast.warning("Tweet content must be at least 20 characters long.");
      return;
    }
    try {
      const { data } = await createTweet(content);
      console.log(data.tweet);
      toast.success("Tweet created successfully!");
      setContent("");
      setOpen(false);
      setTweets((prev) => [
        {
          ...data.tweet,
          owner: {
            fullName: user.fullName,
            username: user.username,
            avatar: user.avatar,
          },
        },
        ...prev,
      ]);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to create tweet";
      toast.error(message);
      console.log(error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <FileText className="mr-2 size-4" />
          Create Tweet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new tweet</DialogTitle>
          <DialogDescription>
            Share your thoughts with the world!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Label className="sr-only" htmlFor="tweetContent">
            Tweet Content
          </Label>
          <Textarea
            id="tweetContent"
            placeholder="What's happening?"
            className="w-full"
            rows={4}
            maxLength={280}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button className="ml-2" onClick={handleTweetCreate}>
            Tweet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTweet;
