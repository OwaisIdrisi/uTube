import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Bell, BellOff, CheckCircle, Grid, List } from "lucide-react";
import { useEffect, useState } from "react";
import { getSubscribedChannels, toggleSubscription } from "@/api/subscription";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Subscriptions() {
  const [subscribedChannels, setSubscribedChannels] = useState([]);

  useEffect(() => {
    // Fetch subscribed channels from API or context
    const fetchSubscribedChannels = async () => {
      const response = await getSubscribedChannels();
      console.log(response.data);
      setSubscribedChannels(response.data?.channels || []);
    };

    fetchSubscribedChannels();
  }, []);

  const handleSubscription = async (channelId) => {
    try {
      const response = await toggleSubscription(channelId);
      if (response.success) {
        // Update the UI or state based on the new subscription status
        setSubscribedChannels((prevChannels) =>
          prevChannels.map((channel) =>
            channel._id === channelId
              ? { ...channel, isSubscribed: !channel.isSubscribed }
              : channel
          )
        );
        toast.success("Subscription status updated");
      }
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  if (subscribedChannels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 w-full">
        <h2 className="text-lg font-semibold">No Subscribed Channels</h2>
        <p className="text-sm text-muted-foreground">
          You are not subscribed to any channels.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>
      {/* Subscribed Channels */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Your Channels</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subscribedChannels.map((channel) => (
            <Card
              key={channel._id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="relative size-12 overflow-hidden rounded-full">
                    <img
                      src={channel.avatar || "/placeholder.svg"}
                      alt={`${channel.name} avatar`}
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/channel/${channel.username}`}
                        className="font-medium hover:text-primary truncate"
                      >
                        {channel.fullname}
                      </Link>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {channel.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {channel.subscribers} subscribers
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        onClick={() => handleSubscription(channel._id)}
                        variant="default"
                        size="sm"
                      >
                        Subscribed
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={
                          channel.notifications
                            ? "Turn off notifications"
                            : "Turn on notifications"
                        }
                      >
                        {channel.notifications ? (
                          <Bell className="size-4 text-primary" />
                        ) : (
                          <BellOff className="size-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

// export default function Subscriptions() {
//   const [subscribedChannels, setSubscribedChannels] = useState([]);

//   useEffect(() => {
//     const fetchSubscribedChannels = async () => {
//       const channels = await getSubscribedChannels();
//       setSubscribedChannels(channels);
//     };

//     fetchSubscribedChannels();
//   }, []);

//   return (
//     <div>
//       <h1>Subscriptions</h1>
//       <div className="grid grid-cols-1 gap-4">
//         {subscribedChannels.map((channel) => (
//           <Card key={channel.id}>
//             <CardContent>
//               <Link href={`/channel/${channel.id}`}>
//                 <img
//                   src={channel.thumbnail}
//                   alt={channel.name}
//                   width={100}
//                   height={100}
//                   className="rounded-full"
//                 />
//                 <h2 className="text-lg font-semibold">{channel.name}</h2>
//               </Link>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }
