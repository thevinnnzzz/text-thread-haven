
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Post } from "@/App";

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
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    // Create a new post object
    const newPost: Post = {
      id: uuidv4(),
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
    
    // Simulate API call to create post
    setTimeout(() => {
      setIsSubmitting(false);
      onPostCreated(newPost);
      
      toast({
        description: "Post created successfully!",
        duration: 3000,
      });
      navigate("/"); // Redirect to home page after successful creation
    }, 1000);
  };

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
      
      <Card className="max-w-2xl mx-auto border border-blue-100 shadow-sm">
        <CardHeader className="bg-blue-50 border-b border-blue-100">
          <CardTitle className="text-blue-800">Create Post</CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
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
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2 bg-gray-50 border-t border-blue-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              disabled={isSubmitting}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
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
