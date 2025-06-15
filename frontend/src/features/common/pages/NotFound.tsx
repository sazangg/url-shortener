import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 min-h-screen">
      <h1 className="text-4xl font-bold">404</h1>
      <p>Page not found</p>
      <Button asChild>
        <Link to="/">Go back to home</Link>
      </Button>
    </div>
  );
}
