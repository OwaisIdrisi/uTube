import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelector } from "react-redux";
import { useState } from "react";
import { VideoUploadDialog } from "@/components/shared/Video/VideoUploadDialog";
import Videos from "@/components/shared/Profile/Videos";
import Tweets from "@/components/shared/Profile/Tweets";
import Playlist from "@/components/shared/Profile/Playlist";
import About from "@/components/shared/Profile/About";
import Header from "@/components/shared/Profile/Header";

export default function ProfilePage() {
  const user = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-dvh w-full pt-4">
      <div className="mx-auto flex">
        <div className="min-w-0 flex-1 p-3 sm:p-4">
          <div className="mx-auto max-w-6xl">
            {/* Profile Header */}
            <Header user={user} />

            {/* Profile Tabs */}
            <Tabs defaultValue="videos" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="tweets">Tweets</TabsTrigger>
                <TabsTrigger value="playlists">Playlists</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                {/* <TabsTrigger value="settings">Settings</TabsTrigger> */}
              </TabsList>

              <TabsContent value="videos" className="mt-6">
                {/* profile/vidoes */}
                <Videos setOpen={setOpen} />
              </TabsContent>

              <TabsContent value="about" className="mt-6 w-full">
                {/* profile/about */}
                <About user={user} />
              </TabsContent>

              <TabsContent value="playlists" className="mt-6">
                {/* profile/playlist */}
                <Playlist />
              </TabsContent>

              {/* <TabsContent value="settings" className="mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">
                          Display Name
                        </label>
                        <Input defaultValue={user.displayName} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Username</label>
                        <Input defaultValue={user.username} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input defaultValue={user.email} type="email" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Bio</label>
                        <Textarea defaultValue={user.bio} rows={3} />
                      </div>
                      <Button>Save Changes</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Make channel public</span>
                        <Button variant="outline" size="sm">
                          Toggle
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Allow comments</span>
                        <Button variant="outline" size="sm">
                          Toggle
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Show subscriber count</span>
                        <Button variant="outline" size="sm">
                          Toggle
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email notifications</span>
                        <Button variant="outline" size="sm">
                          Toggle
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent> */}
              <TabsContent value="tweets" className="mt-6">
                {/* profile/tweets */}
                <Tweets userId={user._id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <VideoUploadDialog open={open} onOpenChange={setOpen} />
    </main>
  );
}
