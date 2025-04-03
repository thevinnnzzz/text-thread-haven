
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, PlusCircle, Bell, Menu, X } from "lucide-react";

interface NavbarProps {
  isLoggedIn: boolean;
  user?: {
    id: string;
    email: string;
    username: string;
    avatar_url?: string;
  } | null;
  onLogout: () => void;
}

const Navbar = ({ isLoggedIn, user, onLogout }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 py-3 sticky top-0 z-10">
      <div className="container-forum flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-forum-700 font-bold text-xl">BancaForum</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center px-2 py-1 bg-gray-100 rounded-full flex-1 max-w-md mx-4">
          <Search className="h-4 w-4 text-gray-500 mr-2 ml-2" />
          <input
            type="search"
            placeholder="Search posts..."
            className="bg-transparent border-none outline-none w-full text-sm"
          />
        </div>

        <div className="flex items-center">
          {isLoggedIn ? (
            <>
              <Link to="/create-post">
                <Button variant="ghost" size="icon" className="rounded-full mr-2">
                  <PlusCircle className="h-5 w-5 text-forum-600" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="rounded-full mr-2">
                <Bell className="h-5 w-5 text-gray-600" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-0 ml-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar_url} />
                      <AvatarFallback className="bg-forum-200 text-forum-700">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`/user/${user?.id}`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
          <div className="md:hidden ml-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white pt-2 pb-4 border-b">
          <div className="container-forum space-y-4">
            <div className="flex items-center px-2 py-2 bg-gray-100 rounded-lg">
              <Search className="h-4 w-4 text-gray-500 mr-2 ml-2" />
              <input
                type="search"
                placeholder="Search posts..."
                className="bg-transparent border-none outline-none w-full text-sm"
              />
            </div>
            {!isLoggedIn && (
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/login">
                  <Button className="w-full" variant="outline">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
