
import { useParams } from "react-router-dom";
import { Post } from "@/App";
import PostCard from "@/components/PostCard";

interface UserProfilePageProps {
  posts: Post[];
}

const UserProfilePage = ({ posts }: UserProfilePageProps) => {
  const { userId } = useParams();
  
  // Filter posts by the current user
  const userPosts = posts.filter(post => post.author.id === userId);
  
  return (
    <div className="container-forum py-6">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <h2 className="text-xl font-bold mb-4">Posts</h2>
          
          {userPosts.length > 0 ? (
            userPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">This user hasn't posted anything yet.</p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="font-medium text-lg mb-2">About</h3>
            <p className="text-sm text-gray-600">
              User information would appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
