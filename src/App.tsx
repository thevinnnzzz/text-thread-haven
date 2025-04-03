
import { useState } from "react";
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

const queryClient = new QueryClient();

// Mock user data for demonstration
const mockUser = {
  id: "current-user",
  email: "user@example.com",
  username: "current_user",
  avatar_url: undefined,
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<typeof mockUser | null>(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUser(mockUser);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
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
                  <Route path="/" element={<HomePage />} />
                  <Route path="/post/:postId" element={<PostDetailPage />} />
                  <Route path="/create-post" element={<CreatePostPage />} />
                  <Route path="/user/:userId" element={<UserProfilePage />} />
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
