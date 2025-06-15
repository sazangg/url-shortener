import { useAuth } from "@/app/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ShowIfLoggedIn, ShowIfNotLoggedIn } from "@/features/auth/components/Guards";
import { Link } from "react-router";

export default function NavigationMenu() {
  const { logout } = useAuth();

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
          <Button variant="outline" onClick={logout}>
            Logout
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
