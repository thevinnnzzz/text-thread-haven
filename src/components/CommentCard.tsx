
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { ThumbsUp, Reply } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface CommentCardProps {
  comment: {
    id: string;
    content: string;
    created_at: string;
    likes_count: number;
    author: {
      id: string;
      username: string;
      avatar_url?: string;
    };
  };
  isLiked?: boolean;
  onLike?: (commentId: string, isLiked: boolean) => void;
  onReply?: (commentId: string) => void;
}

const CommentCard = ({ comment, isLiked = false, onLike, onReply }: CommentCardProps) => {
  const [liked, setLiked] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(comment.likes_count);

  const handleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    toast({
      description: newLikedState ? "Comment liked!" : "Comment unliked",
      duration: 1500,
    });
    
    if (onLike) {
      onLike(comment.id, newLikedState);
    }
  };

  return (
    <div className="py-4 border-b border-blue-100 last:border-b-0">
      <div className="flex gap-3">
        <Link to={`/user/${comment.author.id}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author.avatar_url} />
            <AvatarFallback className="bg-blue-100 text-blue-700">
              {comment.author.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <Link to={`/user/${comment.author.id}`} className="font-medium text-sm text-gray-900 mr-2 hover:text-blue-700">
              {comment.author.username}
            </Link>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>
          
          <div className="text-gray-700 mb-2">
            {comment.content}
          </div>
          
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`px-2 py-1 h-auto text-xs flex items-center ${liked ? 'text-blue-600' : 'text-gray-600'} hover:bg-blue-50`}
              onClick={handleLike}
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              <span>{likesCount > 0 ? likesCount : ''}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="px-2 py-1 h-auto text-xs flex items-center hover:bg-blue-50"
              onClick={() => onReply && onReply(comment.id)}
            >
              <Reply className="h-3 w-3 mr-1" />
              <span>Reply</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
