import React, { useEffect, useState } from "react";
import Tweet from "../Tweet/Tweet";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { getUserTweets } from "@/api/tweet";
import CreateTweet from "../Tweet/CreateTweet";

const Tweets = ({ userId }) => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    // Fetch tweets from an API or other source
    const fetchTweets = async () => {
      try {
        const { data } = await getUserTweets(userId);
        console.log(data);
        setTweets(data?.tweets);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      }
    };

    fetchTweets();
  }, [userId]);

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Tweets</h2>
        {/* <Button onClick={handleTweetCreate}>
          <FileText className="mr-2 size-4" />
          Create Tweet
        </Button> */}
        <CreateTweet setTweets={setTweets} />
      </div>
      {tweets.length === 0 && (
        <div className="flex flex-col items-center w-full pt-10 ">
          <h2 className="text-xl font-semibold">No Tweets Found</h2>
        </div>
      )}
      <div className="flex flex-row flex-wrap items-center justify-center gap-3">
        {tweets.map((tweet) => (
          <Tweet tweet={tweet} key={tweet._id} />
        ))}
      </div>
    </>
  );
};

export default Tweets;
