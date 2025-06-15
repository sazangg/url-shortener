import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import AuthForm from "../components/AuthForm";
import { AuthNavigation } from "../components/AuthNavigation";
import toast from "react-hot-toast";
import { useAuth } from "@/app/hooks/useAuth";
import { useSignup } from "../hooks/useSignup";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const signupMutation = useSignup();

  const onSubmit = (data: FormData) => {
    toast.promise(
      signupMutation.mutateAsync(data).then(({ access_token }) => {
        auth.login(access_token);
        navigate("/");
      }),
      {
        loading: "Creating account…",
        success: "Welcome!",
        error: "Account creation failed, please try again",
      }
    );
  };

  return (
    <div className="flex flex-col justify-center items-center flex-1 min-h-screen mx-auto bg-amber-50">
      <div className="flex flex-col gap-4 w-full max-w-md">
        <AuthNavigation />
        <AuthForm
          title="Sign up"
          description="Enter your email and password below to create your account."
          onSubmit={onSubmit}
          action="Sign up"
          isLoading={signupMutation.isPending}
        />
        <Button variant="link">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
