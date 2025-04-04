import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import PostDetailPage from "@/pages/PostDetailPage";
import CreatePostPage from "@/pages/CreatePostPage";
import UserProfilePage from "@/pages/UserProfilePage";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/NotFound";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { seedTestUserProfile } from "@/integrations/supabase/seed-data";

const queryClient = new QueryClient();

// Define Post type for better type safety
export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  author: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    email: string;
    username: string;
    avatar_url?: string;
  } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create a proper UUID for the mock user
  useEffect(() => {
    const setupMockUser = async () => {
      // In a real app, this would come from Supabase Auth
      // For now, we'll create a proper UUID to use
      const mockUserId = localStorage.getItem('mockUserId') || uuidv4();
      
      // Store the ID so it persists across refreshes
      if (!localStorage.getItem('mockUserId')) {
        localStorage.setItem('mockUserId', mockUserId);
      }
      
      try {
        // Ensure we have a user profile in the database
        const profile = await seedTestUserProfile(mockUserId);
        
        const mockUser = {
          id: mockUserId,
          email: "user@example.com",
          username: profile?.username || "current_user",
          avatar_url: profile?.avatar_url,
        };
        
        setUser(mockUser);
        // Auto-login for development
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error setting up mock user:", error);
      }
    };
    
    setupMockUser();
  }, []);

  // Fetch posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("posts")
          .select(`
            id, 
            title,
            content,
            created_at,
            likes_count,
            comments_count,
            user_id,
            profiles:user_id (
              id,
              username,
              avatar_url
            )
          `)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching posts:", error);
          throw error;
        }

        if (data) {
          // Transform the data to match our Post interface
          const formattedPosts: Post[] = data.map(post => ({
            id: post.id,
            title: post.title,
            content: post.content,
            created_at: post.created_at,
            likes_count: post.likes_count || 0,
            comments_count: post.comments_count || 0,
            author: {
              id: post.profiles.id,
              username: post.profiles.username,
              avatar_url: post.profiles.avatar_url,
            }
          }));
          
          setPosts(formattedPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast({
          title: "Error",
          description: "Failed to load posts. Please try again later.",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();

    // Set up real-time subscription for post updates
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'posts' 
      }, () => {
        // Reload posts when any changes happen
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleCreatePost = async (newPost: Post) => {
    try {
      console.log("Creating post with data:", {
        title: newPost.title,
        content: newPost.content,
        user_id: newPost.author.id
      });
      
      // Save the post to Supabase
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title: newPost.title,
          content: newPost.content,
          user_id: newPost.author.id,
        })
        .select();

      if (error) {
        console.error("Error creating post:", error);
        throw error;
      }

      console.log("Post created successfully:", data);
      
      // The post will be added to the state via the realtime subscription
      toast({
        description: "Post created successfully!",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again later.",
        duration: 3000,
      });
    }
  };

  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-background">
              <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
              <main className="flex-1">
                <Routes>
                  <Route 
                    path="/" 
                    element={<HomePage posts={posts} isLoading={isLoading} />} 
                  />
                  <Route 
                    path="/post/:postId" 
                    element={<PostDetailPage posts={posts} />} 
                  />
                  <Route 
                    path="/create-post" 
                    element={
                      <CreatePostPage 
                        onPostCreated={handleCreatePost} 
                        currentUser={user}
                      />
                    } 
                  />
                  <Route 
                    path="/user/:userId" 
                    element={<UserProfilePage posts={posts} />} 
                  />
                  <Route path="/login" element={<AuthPage mode="login" onLogin={handleLogin} />} />
                  <Route path="/register" element={<AuthPage mode="register" />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <footer className="py-6 border-t border-border">
                <div className="container-forum text-center text-muted-foreground text-sm">
                  &copy; {new Date().getFullYear()} BancaForum. All rights reserved.
                </div>
              </footer>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
