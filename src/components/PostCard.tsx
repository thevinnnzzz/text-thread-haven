
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface PostCardProps {
  post: {
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
  };
  isLiked?: boolean;
  onLike?: (postId: string, isLiked: boolean) => void;
  compact?: boolean;
}

const PostCard = ({ post, isLiked = false, onLike, compact = false }: PostCardProps) => {
  const [liked, setLiked] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  const handleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    // Show toast notification
    toast({
      description: newLikedState ? "Post liked successfully!" : "Post unliked",
      duration: 2000,
    });
    
    if (onLike) {
      onLike(post.id, newLikedState);
    }
  };

  return (
    <Card className="mb-4 overflow-hidden hover:shadow-md transition-shadow border border-blue-100">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <Link to={`/user/${post.author.id}`} className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={post.author.avatar_url} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                {post.author.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700">
              {post.author.username}
            </span>
          </Link>
          <span className="text-xs text-gray-500 ml-2">
            • {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </span>
        </div>

        <Link to={`/post/${post.id}`}>
          <h2 className="text-lg font-medium mb-2 hover:text-blue-700 transition-colors">
            {post.title}
          </h2>
          
          {!compact && (
            <div className="text-gray-700 mb-2 line-clamp-3">
              {post.content}
            </div>
          )}
        </Link>
      </CardContent>

      <CardFooter className="px-4 py-2 bg-blue-50 flex justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-xs flex items-center ${liked ? 'text-blue-600' : 'text-gray-600'}`}
            onClick={handleLike}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span>{likesCount}</span>
          </Button>
          
          <Link to={`/post/${post.id}`}>
            <Button variant="ghost" size="sm" className="text-xs flex items-center text-gray-600">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{post.comments_count}</span>
            </Button>
          </Link>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs flex items-center text-gray-600"
          onClick={() => {
            toast({
              description: "Share functionality coming soon!",
              duration: 2000,
            });
          }}
        >
          <Share2 className="h-4 w-4 mr-1" />
          <span>Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
