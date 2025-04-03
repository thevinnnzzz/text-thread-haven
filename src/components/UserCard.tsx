
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface UserCardProps {
  user: {
    id: string;
    username: string;
    avatar_url?: string;
    follower_count: number;
    bio?: string;
  };
  isFollowing?: boolean;
  onFollow?: (userId: string, isFollowing: boolean) => void;
}

const UserCard = ({ user, isFollowing = false, onFollow }: UserCardProps) => {
  const [following, setFollowing] = useState(isFollowing);
  const [followerCount, setFollowerCount] = useState(user.follower_count);

  const handleFollow = () => {
    const newFollowingState = !following;
    setFollowing(newFollowingState);
    setFollowerCount(prev => newFollowingState ? prev + 1 : prev - 1);
    if (onFollow) {
      onFollow(user.id, newFollowingState);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Link to={`/user/${user.id}`} className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="bg-forum-200 text-forum-700">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-gray-900">{user.username}</div>
              <div className="text-xs text-gray-500">{followerCount} followers</div>
            </div>
          </Link>
          
          <Button
            variant={following ? "outline" : "default"}
            size="sm"
            onClick={handleFollow}
            className={following ? "text-forum-700 border-forum-300" : ""}
          >
            {following ? "Following" : "Follow"}
          </Button>
        </div>
        
        {user.bio && (
          <div className="mt-3 text-sm text-gray-600">
            {user.bio}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCard;
