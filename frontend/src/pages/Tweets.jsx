import { getAllTweets } from "@/api/tweet";
import Tweet from "@/components/shared/Tweet/Tweet";
import { Button } from "@/components/ui/button";
import React from "react";

const Tweets = () => {
  const [tweets, setTweets] = React.useState([]);

  React.useEffect(() => {
    const fetchTweets = async () => {
      try {
        const { data } = await getAllTweets();
        setTweets(data?.tweets);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTweets();
  }, []);

  if (tweets.length === 0) {
    return (
      <div className="flex flex-col items-center min-h-[calc(100vh-56px)] w-full bg-[#F0F0F0] pt-10 ">
        <img
          className="mt-10 md:w-60"
          src="https://fairplay.video/images/feature-not-available.png"
          alt="Tweets feature not available"
        />
        <p className="mt-6 text-gray-600 text-xl">Nothing here yet</p>
      </div>
    );
  }
  return (
    <div className="min-h-[calc(100vh-56px)] w-full bg-[#F0F0F0] pt-10">
      {/* <h1 className="text-3xl font-bold">Tweet Page</h1> */}
      <div className="flex flex-col justify-center items-center gap-4 p-3 sm:p-4 w-full">
        <div className="w-full flex flex-row flex-wrap items-center justify-center gap-3 ">
          {tweets.map((tweet) => (
            <Tweet tweet={tweet} key={tweet._id} />
          ))}
        </div>
        <div className="btns flex gap-4 my-4">
          <Button
            variant="outline"
            className="cursor-pointer hover:bg-primary hover:text-white"
            disabled
          >
            Previous Page
          </Button>

          <Button
            variant="outline"
            className="cursor-pointer hover:bg-primary hover:text-white"
          >
            Next Page
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Tweets;
