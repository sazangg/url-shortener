import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("You must enter a valid email!"),
  password: z.string().min(8, "Password must be at least 8 characters long!"),
});

type FormData = z.infer<typeof formSchema>;

type AuthFormProps = {
  title: string;
  description: string;
  onSubmit: (data: FormData) => void;
  action: string;
  isLoading: boolean;
};

export default function AuthForm({
  title,
  description,
  onSubmit,
  action,
  isLoading,
}: AuthFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Form {...form}>
          <form
            id="auth-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="test@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="**********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button form="auth-form" type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader className="animate-spin"/> : action}
        </Button>
      </CardFooter>
    </Card>
  );
}
