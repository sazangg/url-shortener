import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import AuthForm from "../components/AuthForm";
import { AuthNavigation } from "../components/AuthNavigation";
import { useLogin } from "../hooks/useLogin";
import toast from "react-hot-toast";
import { useAuth } from "@/app/hooks/useAuth";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const onSubmit = (data: FormData) => {
    toast.promise(
      loginMutation.mutateAsync(data).then(({ access_token }) => {
        auth.login(access_token);
        navigate("/");
      }),
      {
        loading: "Signing in...",
        success: "Welcome back!",
        error: "Invalid credentials",
      }
    );
  };

  return (
    <div className="flex flex-col justify-center items-center flex-1 min-h-screen mx-auto bg-amber-50">
      <div className="flex flex-col gap-4 w-full max-w-md">
        <AuthNavigation />
        <AuthForm
          title="Login"
          description="Enter your email and password below to login to your account."
          onSubmit={onSubmit}
          action="Login"
          isLoading={loginMutation.isPending}
        />
        <Button variant="link">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
