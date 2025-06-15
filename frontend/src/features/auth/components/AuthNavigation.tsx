import { Link, useLocation, useNavigate } from "react-router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AuthNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    if (location.pathname === "/auth/signup") {
      return "signup";
    }
    return "login";
  };

  const handleTabChange = (value: string) => {
    navigate(`/auth/${value}`);
  };

  return (
    <div className="w-full max-w-md">
      <Tabs value={getActiveTab()} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">
            <Link to="/auth/login">Login</Link>
          </TabsTrigger>
          <TabsTrigger value="signup">
            <Link to="/auth/signup">Sign Up</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
