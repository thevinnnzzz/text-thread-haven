import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, MessageSquare, Share2, ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import CommentCard from "@/components/CommentCard";
import { toast } from "@/components/ui/use-toast";
import { Post } from "@/App";
import { supabase } from "@/integrations/supabase/client";

interface PostDetailPageProps {
  posts: Post[];
}

// Empty post data structure
const EMPTY_POST = {
  id: "",
  title: "",
  content: "",
  created_at: new Date().toISOString(),
  likes_count: 0,
  comments_count: 0,
  author: {
    id: "",
    username: "",
    avatar_url: undefined
  }
};

const PostDetailPage = ({ posts }: PostDetailPageProps) => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      
      try {
        // First check if we already have the post in our state
        const existingPost = posts.find(p => p.id === postId);
        
        if (existingPost) {
          setPost(existingPost);
          setLikesCount(existingPost.likes_count);
          setLoading(false);
          return;
        }
        
        // If not, fetch it from Supabase
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
          .eq("id", postId)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          const formattedPost: Post = {
            id: data.id,
            title: data.title,
            content: data.content,
            created_at: data.created_at,
            likes_count: data.likes_count || 0,
            comments_count: data.comments_count || 0,
            author: {
              id: data.profiles.id,
              username: data.profiles.username,
              avatar_url: data.profiles.avatar_url,
            }
          };
          
          setPost(formattedPost);
          setLikesCount(formattedPost.likes_count);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    // Fetch comments
    const fetchComments = async () => {
      try {
        const { data, error } = await supabase
          .from("comments")
          .select(`
            id,
            content,
            created_at,
            user_id,
            profiles:user_id (
              id,
              username,
              avatar_url
            )
          `)
          .eq("post_id", postId)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          const formattedComments = data.map(comment => ({
            id: comment.id,
            content: comment.content,
            created_at: comment.created_at,
            likes_count: 0, // We'll implement this later
            author: {
              id: comment.profiles.id,
              username: comment.profiles.username,
              avatar_url: comment.profiles.avatar_url,
            }
          }));
          
          setComments(formattedComments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (postId) {
      fetchPost();
      fetchComments();
    }
  }, [postId, posts]);

  const handleLike = async () => {
    if (!post) return;
    
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    // In a real app, you would save this to Supabase
    // This is just a mock implementation for now
    toast({
      description: newLikedState ? "Post liked successfully!" : "Post unliked",
      duration: 2000,
    });
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    
    setSubmittingComment(true);
    
    try {
      // In a real app, you would save the comment to Supabase
      // This is just a mock implementation for now
      
      setTimeout(() => {
        const newComment = {
          id: `temp-${Date.now()}`,
          content: commentText,
          created_at: new Date().toISOString(),
          likes_count: 0,
          author: {
            id: "current-user", // Would be the actual user ID
            username: "current_user", // Would be the actual username
            avatar_url: undefined
          }
        };
        
        setComments(prev => [newComment, ...prev]);
        setCommentText("");
        
        toast({
          description: "Comment added successfully!",
          duration: 2000,
        });
      }, 1000);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        duration: 3000,
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="container-forum py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-forum py-12">
        <div className="text-center bg-blue-50 p-8 rounded-lg border border-blue-100 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2 text-blue-800">Post not found</h2>
          <p className="text-gray-600 mb-4">The post you're looking for doesn't exist or has been removed.</p>
          <div className="flex justify-center space-x-4">
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700">Return to Home</Button>
            </Link>
            <Link to="/create-post">
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">Create a Post</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-forum py-6">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700">
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Back to posts</span>
        </Link>
      </div>
      
      <Card className="mb-6 border border-blue-100 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Link to={`/user/${post.author.id}`} className="flex items-center">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={post.author.avatar_url} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {post.author.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.author.username}</div>
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </div>
              </div>
            </Link>
          </div>
          
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          
          <div className="prose max-w-none text-gray-700 whitespace-pre-line">
            {post.content}
          </div>
        </CardContent>
        
        <CardFooter className="px-6 py-4 bg-blue-50 flex justify-between border-t border-blue-100">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className={`flex items-center ${liked ? 'text-blue-600' : 'text-gray-600'} hover:bg-blue-100`}
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              <span>{likesCount}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="flex items-center text-gray-600 hover:bg-blue-100"
              onClick={() => document.getElementById('comment-box')?.focus()}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>{comments.length}</span>
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            className="flex items-center text-gray-600 hover:bg-blue-100"
            onClick={() => {
              toast({
                description: "Share functionality coming soon!",
                duration: 2000,
              });
            }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            <span>Share</span>
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-blue-800">Comments</h2>
        <Card className="border border-blue-100 shadow-sm">
          <CardContent className="p-4">
            <Textarea
              id="comment-box"
              placeholder="Add a comment..."
              className="mb-3 resize-none border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleCommentSubmit} 
                disabled={!commentText.trim() || submittingComment}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {submittingComment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post Comment'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        {comments.length > 0 ? (
          <Card className="border border-blue-100 shadow-sm">
            <CardContent className="p-0 divide-y divide-blue-100">
              {comments.map(comment => (
                <div key={comment.id} className="px-4">
                  <CommentCard 
                    comment={comment} 
                    onReply={(commentId) => {
                      setCommentText(`@${comment.author.username} `);
                      document.getElementById('comment-box')?.focus();
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-8 bg-blue-50 rounded-lg">
            <p className="text-blue-600">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
