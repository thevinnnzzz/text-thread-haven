
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/PostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

// Mocked data for now, will connect to Supabase later
const MOCK_POSTS = [
  {
    id: "1",
    title: "Welcome to BancaForum! Share your thoughts and ideas.",
    content: "This is a community for discussion and knowledge sharing. Let's build a great community together! Feel free to create your first post and start engaging with others.",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    likes_count: 42,
    comments_count: 13,
    author: {
      id: "1",
      username: "admin",
      avatar_url: undefined
    }
  },
  {
    id: "2",
    title: "What's your favorite productivity hack?",
    content: "I've been trying to improve my productivity lately. What are some of your favorite productivity hacks or tools that have made a real difference in your work?",
    created_at: new Date(Date.now() - 7200000).toISOString(),
    likes_count: 18,
    comments_count: 24,
    author: {
      id: "2",
      username: "productivity_guru",
      avatar_url: undefined
    }
  },
  {
    id: "3",
    title: "Book recommendations for summer reading",
    content: "Summer is approaching, and I'm looking for some good books to read. Any recommendations for fiction, non-fiction, or anything in between?",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    likes_count: 31,
    comments_count: 42,
    author: {
      id: "3",
      username: "bookworm",
      avatar_url: undefined
    }
  }
];

const HomePage = () => {
  const [posts, setPosts] = useState<typeof MOCK_POSTS>([]);
  const [loading, setLoading] = useState(true);

  // Simulate loading posts
  useEffect(() => {
    const timer = setTimeout(() => {
      setPosts(MOCK_POSTS);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
                  <Button>Create Post</Button>
                </Link>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-forum-600" />
                </div>
              ) : (
                posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
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
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <h2 className="font-medium text-lg mb-3">About BancaForum</h2>
            <p className="text-sm text-gray-600 mb-4">A community for text-based discussions. Join conversations, share thoughts, and connect with others.</p>
            <Link to="/register">
              <Button className="w-full">Join Now</Button>
            </Link>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="font-medium text-lg mb-3">Community Guidelines</h2>
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
