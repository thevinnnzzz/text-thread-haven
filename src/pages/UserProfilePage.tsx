
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Post } from "@/App";
import PostCard from "@/components/PostCard";
import { Loader2, User, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface UserProfilePageProps {
  posts: Post[];
}

interface UserProfile {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

const UserProfilePage = ({ posts }: UserProfilePageProps) => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter posts by the current user
  const userPosts = posts.filter(post => post.author.id === userId);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        // First try to get from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user profile:', error);
          throw error;
        }
        
        if (data) {
          setUserProfile(data as UserProfile);
        } else {
          // If we don't find it, use information from the posts
          const matchingPost = posts.find(post => post.author.id === userId);
          
          if (matchingPost) {
            setUserProfile({
              id: matchingPost.author.id,
              username: matchingPost.author.username,
              avatar_url: matchingPost.author.avatar_url,
              created_at: new Date().toISOString(),
            });
          } else {
            setUserProfile(null);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user profile",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, posts]);
  
  if (isLoading) {
    return (
      <div className="container-forum py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }
  
  if (!userProfile && !isLoading) {
    return (
      <div className="container-forum py-12">
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2">User Not Found</h2>
          <p className="text-gray-500 mb-4">The profile you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-forum py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <h2 className="text-xl font-bold mb-4">Posts by {userProfile?.username || "User"}</h2>
          
          {userPosts.length > 0 ? (
            userPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">This user hasn't posted anything yet.</p>
              <Link to="/create-post">
                <Button variant="outline" className="mt-4">
                  Create a post
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center py-4">
                <div className="bg-blue-100 p-6 rounded-full mb-4">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="font-medium text-lg">{userProfile?.display_name || userProfile?.username}</h3>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  Member since {userProfile?.created_at 
                    ? new Date(userProfile.created_at).toLocaleDateString()
                    : "recently"}
                </p>
              </div>
              
              <div className="border-t pt-4 mt-2">
                <h4 className="font-medium mb-2">About</h4>
                <p className="text-sm text-gray-600">
                  {userProfile?.bio || "No bio provided yet."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
