
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Calendar, MapPin } from "lucide-react";
import PostCard from "@/components/PostCard";

// Mock data
const MOCK_USER = {
  id: "1",
  username: "admin",
  name: "Admin User",
  avatar_url: undefined,
  bio: "Founder and admin of BancaForum. Passionate about building online communities and fostering meaningful discussions.",
  follower_count: 128,
  following_count: 42,
  joined_date: "2023-01-15T12:00:00Z",
  location: "San Francisco, CA"
};

const MOCK_POSTS = [
  {
    id: "1",
    title: "Welcome to BancaForum! Share your thoughts and ideas.",
    content: "This is a community for discussion and knowledge sharing. Let's build a great community together!",
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
    id: "4",
    title: "How to get the most out of BancaForum",
    content: "Here are some tips for new users to make the most of their BancaForum experience...",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    likes_count: 27,
    comments_count: 8,
    author: {
      id: "1",
      username: "admin",
      avatar_url: undefined
    }
  }
];

const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<typeof MOCK_USER | null>(null);
  const [posts, setPosts] = useState<typeof MOCK_POSTS>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  // Simulate loading user data
  useEffect(() => {
    const timer = setTimeout(() => {
      setUser(MOCK_USER);
      setPosts(MOCK_POSTS);
      setFollowerCount(MOCK_USER.follower_count);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [userId]);

  const handleFollow = () => {
    const newFollowingState = !following;
    setFollowing(newFollowingState);
    setFollowerCount(prev => newFollowingState ? prev + 1 : prev - 1);
    // Here you would call an API to update the follow status
  };

  if (loading) {
    return (
      <div className="container-forum py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-forum-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-forum py-12">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">User not found</h2>
          <p className="text-gray-600 mb-4">The user you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-forum py-6">
      <Card className="mb-6 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-forum-500 to-forum-700"></div>
        <CardContent className="pt-0">
          <div className="flex flex-col md:flex-row md:items-end -mt-12 mb-4">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="text-2xl bg-forum-200 text-forum-700">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="mt-4 md:mt-0 md:ml-4 md:mb-2 flex-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <div className="text-gray-600">@{user.username}</div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Button
                onClick={handleFollow}
                variant={following ? "outline" : "default"}
                className={following ? "border-forum-300 text-forum-700" : ""}
              >
                {following ? "Following" : "Follow"}
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-4">{user.bio}</p>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
              {user.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{user.location}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  Joined {formatDistanceToNow(new Date(user.joined_date), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 text-sm">
            <div>
              <span className="font-semibold">{followerCount}</span> followers
            </div>
            <div>
              <span className="font-semibold">{user.following_count}</span> following
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="posts">
        <TabsList className="w-full">
          <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
          <TabsTrigger value="comments" className="flex-1">Comments</TabsTrigger>
          <TabsTrigger value="likes" className="flex-1">Likes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="mt-6">
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post.id} post={post} compact />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No posts yet</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="comments" className="mt-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Comments will appear here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="likes" className="mt-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Liked posts will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfilePage;
