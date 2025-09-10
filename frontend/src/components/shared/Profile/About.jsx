import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const About = ({ user }) => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Channel Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Subscribers</span>
            <span className="font-medium">{user.subscribers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Views</span>
            <span className="font-medium">{user.totalViews}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Videos Uploaded</span>
            <span className="font-medium">{user.videosCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Channel Created</span>
            <span className="font-medium">{user.joinDate}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Channel Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Welcome to my channel! I create content about technology,
            programming tutorials, product reviews, and gaming. My goal is to
            help others learn and grow in the tech industry while having fun
            along the way.
          </p>
          <div className="mt-4">
            <h4 className="font-medium">Links</h4>
            <div className="mt-2 space-y-1 text-sm">
              <a href="#" className="block text-blue-600 hover:underline">
                Website: johndoe.dev
              </a>
              <a href="#" className="block text-blue-600 hover:underline">
                Twitter: @johndoe
              </a>
              <a href="#" className="block text-blue-600 hover:underline">
                GitHub: github.com/johndoe
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
