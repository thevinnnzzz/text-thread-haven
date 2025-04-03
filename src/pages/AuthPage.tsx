import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

interface AuthFormData {
  email: string;
  username?: string;
  password: string;
}

interface AuthPageProps {
  mode: "login" | "register";
  onLogin?: () => void;  // Make onLogin optional
}

const AuthPage = ({ mode, onLogin }: AuthPageProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    username: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!formData.email || !formData.password || (mode === "register" && !formData.username)) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      if (onLogin && mode === "login") {
        onLogin();
      }
      navigate("/");
    }, 1500);
  };

  return (
    <div className="container-forum min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <Tabs defaultValue={mode} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" asChild>
              <Link to="/login">Log In</Link>
            </TabsTrigger>
            <TabsTrigger value="register" asChild>
              <Link to="/register">Sign Up</Link>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={mode}>
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {mode === "login" ? "Welcome Back" : "Create an Account"}
                </CardTitle>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {mode === "register" && (
                    <div className="space-y-2">
                      <label htmlFor="username" className="text-sm font-medium">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="username"
                        name="username"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder={mode === "login" ? "Enter your password" : "Create a password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  {error && (
                    <div className="text-red-500 text-sm">
                      {error}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {mode === "login" ? "Logging in..." : "Creating account..."}
                      </>
                    ) : (
                      mode === "login" ? "Log In" : "Sign Up"
                    )}
                  </Button>
                  
                  {mode === "login" && (
                    <div className="text-center text-sm">
                      <Link to="/forgot-password" className="text-forum-600 hover:underline">
                        Forgot your password?
                      </Link>
                    </div>
                  )}
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
