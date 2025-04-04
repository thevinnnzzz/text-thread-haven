
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Post } from "@/App";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface CreatePostPageProps {
  onPostCreated: (post: Post) => void;
  currentUser: {
    id: string;
    username: string;
    avatar_url?: string;
  } | null;
}

const CreatePostPage = ({ onPostCreated, currentUser }: CreatePostPageProps) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Verify user authentication when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No active session found");
          setError("You must be logged in to create a post. This is a development app with mock authentication.");
        } else {
          console.log("Active session found for user:", session.user.id);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Please enter a title for your post");
      return;
    }
    
    if (!content.trim()) {
      setError("Please enter content for your post");
      return;
    }

    if (!currentUser) {
      setError("You must be logged in to create a post");
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "You must be logged in to create a post. For this demo, we're using a mock user.",
      });
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      console.log("Attempting to create post with user ID:", currentUser.id);
      
      // Create a new post object
      const newPost: Post = {
        id: uuidv4(), // This will be replaced by the database
        title: title.trim(),
        content: content.trim(),
        created_at: new Date().toISOString(),
        likes_count: 0,
        comments_count: 0,
        author: {
          id: currentUser.id,
          username: currentUser.username,
          avatar_url: currentUser.avatar_url
        }
      };
      
      // Log the post data before submission
      console.log("Submitting post data:", {
        title: newPost.title,
        content: newPost.content,
        user_id: currentUser.id
      });
      
      await onPostCreated(newPost);
      
      toast({
        title: "Success",
        description: "Post created successfully!",
        duration: 3000,
      });
      
      navigate("/"); // Redirect to home page after successful creation
    } catch (error) {
      console.error("Error in form submission:", error);
      setError("Failed to create post. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render explanation alert for demo purposes
  const renderDemoAlert = () => (
    <Alert className="mb-6 bg-blue-50 border-blue-200">
      <AlertTitle className="text-blue-800">Development Mode</AlertTitle>
      <AlertDescription className="text-blue-700">
        This forum uses a mock user for demonstration purposes. In a real application, 
        you would need to sign in with your credentials to create posts.
      </AlertDescription>
    </Alert>
  );

  return (
    <div className="container-forum py-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="flex items-center text-blue-600 p-0 hover:bg-transparent hover:text-blue-700"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </Button>
      </div>
      
      {renderDemoAlert()}
      
      <Card className="max-w-2xl mx-auto border border-blue-100 shadow-sm">
        <CardHeader className="bg-blue-50 border-b border-blue-100">
          <CardTitle className="text-blue-800">Create Post</CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            {isCheckingAuth ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                <span>Verifying authentication...</span>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="title"
                    placeholder="Give your post a title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium text-gray-700">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px] resize-y border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    required
                  />
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                {currentUser && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md text-sm">
                    You are posting as: <span className="font-medium">{currentUser.username}</span>
                  </div>
                )}
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2 bg-gray-50 border-t border-blue-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              disabled={isSubmitting || isCheckingAuth}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || isCheckingAuth || !currentUser}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Post...
                </>
              ) : (
                'Create Post'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreatePostPage;
