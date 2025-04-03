
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, MessageSquare, Share2, ChevronLeft, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import CommentCard from "@/components/CommentCard";

// Mock data
const MOCK_POST = {
  id: "1",
  title: "Welcome to BancaForum! Share your thoughts and ideas.",
  content: "This is a community for discussion and knowledge sharing. Let's build a great community together! Feel free to create your first post and start engaging with others.\n\nBancaForum is designed to be a place where everyone can share their thoughts, ask questions, and engage in meaningful discussions. We believe in the power of community-driven content and aim to create a platform that fosters respectful and constructive dialogue.\n\nJoin us in making this a vibrant space for exchanging ideas!",
  created_at: new Date(Date.now() - 3600000).toISOString(),
  likes_count: 42,
  comments_count: 13,
  author: {
    id: "1",
    username: "admin",
    avatar_url: undefined
  }
};

const MOCK_COMMENTS = [
  {
    id: "1",
    content: "This is exactly what I've been looking for! A clean, focused discussion platform without all the noise.",
    created_at: new Date(Date.now() - 1800000).toISOString(),
    likes_count: 8,
    author: {
      id: "2",
      username: "early_adopter",
      avatar_url: undefined
    }
  },
  {
    id: "2",
    content: "I'm excited to see how this community grows. The focus on text-based discussions is refreshing.",
    created_at: new Date(Date.now() - 3000000).toISOString(),
    likes_count: 5,
    author: {
      id: "3",
      username: "forum_enthusiast",
      avatar_url: undefined
    }
  },
  {
    id: "3",
    content: "Great initiative! I hope we can have some really thoughtful exchanges here.",
    created_at: new Date(Date.now() - 4000000).toISOString(),
    likes_count: 3,
    author: {
      id: "4",
      username: "thoughtful_commenter",
      avatar_url: undefined
    }
  }
];

const PostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<typeof MOCK_POST | null>(null);
  const [comments, setComments] = useState<typeof MOCK_COMMENTS>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Simulate loading post and comments
  useEffect(() => {
    const timer = setTimeout(() => {
      setPost(MOCK_POST);
      setComments(MOCK_COMMENTS);
      setLikesCount(MOCK_POST.likes_count);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [postId]);

  const handleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    // Here you would call an API to update the like status
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    
    setSubmittingComment(true);
    
    // Simulate API call
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
      setSubmittingComment(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="container-forum py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-forum-600" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-forum py-12">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Post not found</h2>
          <p className="text-gray-600 mb-4">The post you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-forum py-6">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-forum-600 hover:text-forum-700">
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Back to posts</span>
        </Link>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Link to={`/user/${post.author.id}`} className="flex items-center">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={post.author.avatar_url} />
                <AvatarFallback className="bg-forum-200 text-forum-700">
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
        
        <CardFooter className="px-6 py-4 bg-gray-50 flex justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className={`flex items-center ${liked ? 'text-forum-600' : 'text-gray-600'}`}
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              <span>{likesCount}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="flex items-center text-gray-600"
              onClick={() => document.getElementById('comment-box')?.focus()}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>{comments.length}</span>
            </Button>
          </div>
          
          <Button variant="ghost" className="flex items-center text-gray-600">
            <Share2 className="h-4 w-4 mr-2" />
            <span>Share</span>
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        <Card>
          <CardContent className="p-4">
            <Textarea
              id="comment-box"
              placeholder="Add a comment..."
              className="mb-3 resize-none"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleCommentSubmit} 
                disabled={!commentText.trim() || submittingComment}
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
          <Card>
            <CardContent className="p-0 divide-y">
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
          <div className="text-center py-8">
            <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
