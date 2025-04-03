
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/PostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { Post } from "@/App";

interface HomePageProps {
  posts: Post[];
}

const HomePage = ({ posts }: HomePageProps) => {
  return (
    <div className="container-forum py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Tabs defaultValue="recent" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
            </TabsList>
            <TabsContent value="recent" className="pt-4">
              <div className="mb-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Recent Posts</h1>
                <Link to="/create-post">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Post
                  </Button>
                </Link>
              </div>

              {posts.length > 0 ? (
                posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-blue-50 p-8 rounded-lg w-full max-w-md">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">No posts yet</h3>
                    <p className="text-blue-600 mb-4">Be the first to share your thoughts with the community!</p>
                    <Link to="/create-post">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Your First Post
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="trending" className="pt-4">
              <h1 className="text-xl font-bold mb-4">Trending Posts</h1>
              <div className="flex justify-center py-8">
                <p className="text-muted-foreground">Trending posts will appear here</p>
              </div>
            </TabsContent>
            <TabsContent value="following" className="pt-4">
              <h1 className="text-xl font-bold mb-4">Following Feed</h1>
              <div className="flex justify-center py-8">
                <p className="text-muted-foreground">Posts from users you follow will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden md:block">
          <div className="bg-white rounded-lg border border-blue-100 p-4 mb-4 shadow-sm">
            <h2 className="font-medium text-lg mb-3 text-blue-800">About BancaForum</h2>
            <p className="text-sm text-gray-600 mb-4">A community for text-based discussions. Join conversations, share thoughts, and connect with others.</p>
            <Link to="/register">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Join Now</Button>
            </Link>
          </div>
          
          <div className="bg-white rounded-lg border border-blue-100 p-4 shadow-sm">
            <h2 className="font-medium text-lg mb-3 text-blue-800">Community Guidelines</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Be respectful to others</li>
              <li>• No spam or self-promotion</li>
              <li>• Use descriptive titles</li>
              <li>• Keep discussions constructive</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
