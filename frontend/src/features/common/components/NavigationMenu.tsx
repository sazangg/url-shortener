import { useAuth } from "@/app/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ShowIfLoggedIn, ShowIfNotLoggedIn } from "@/features/auth/components/Guards";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router";

export default function NavigationMenu() {
  const { logout } = useAuth();
  const logoutMutation = useLogout(logout)

  const handleLogout = () => {
    toast.promise(logoutMutation.mutateAsync(), {
      loading: "Logging out...",
      success: "Logged out successfully",
    });
  }

  return (
    <nav className="flex justify-between bg-amber-50 px-4 py-4 items-center">
      <h1 className="text-xl font-bold">Shorten URLs</h1>
      <div className="flex gap-2">
        <ShowIfLoggedIn>
          <Button asChild>
            <Link to="/">Shorten URL</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/my-links">My Links</Link>
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? <Loader className="animate-spin" /> : "Logout"}
          </Button>
        </ShowIfLoggedIn>
        <ShowIfNotLoggedIn>
          <Button asChild variant="outline">
            <Link to="/auth/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/auth/signup">Signup</Link>
          </Button>
        </ShowIfNotLoggedIn>
      </div>
    </nav>
  );
}
