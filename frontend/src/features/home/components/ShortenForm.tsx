import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UrlRead } from "../model";
import { useShorten } from "../hooks/useShorten";
import { Loader } from "lucide-react";

const formSchema = z.object({
  url: z.string().url("You must enter a valid URL!"),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  onDone: (short: UrlRead) => void;
}

export default function ShortenForm({ onDone }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const shortenMutation = useShorten();

  const onSubmit = async (values: FormData) => {
    const data = await shortenMutation.mutateAsync(values.url);
    onDone(data);
    form.reset();
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Shorten Your URL</CardTitle>
        <CardDescription>
          Enter the URL you want to shorten below:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <div className="flex flex-row gap-2">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex flex-1">
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={shortenMutation.isPending}>
                {shortenMutation.isPending ? <Loader className="animate-spin" /> : "Shorten"}
              </Button>
            </div>

            {form.formState.errors.url && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.url.message}
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
