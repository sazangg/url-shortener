import toast from "react-hot-toast";
import type { UrlRead } from "../model";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Link } from "react-router";

type Props = {
  url: UrlRead;
  onNew: () => void;
};

export default function ResultCard({ url, onNew }: Props) {
  const handleCopy = () => {
    navigator.clipboard.writeText(url.short_url);
    toast.success("Copied to clipboard");
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="pb-2">
        <h1 className="font-semibold text-muted-foreground text-xs tracking-widest uppercase">
          Your shortened URL
        </h1>
      </CardHeader>
      <CardContent className="flex justify-between">
        <div className="flex flex-col gap-2">
          <Link
            to={url.short_url}
            target="_blank"
            rel="noreferrer"
            className="text-primary text-2xl md:text-3xl font-bold hover:underline break-all transition-colors"
          >
            {url.short_url}
          </Link>
          <div className="text-xs text-muted-foreground mt-1 break-all">
            Original: <span className="font-medium">{url.original_url}</span>
          </div>
          {url.expires_at && (
            <div className="text-xs text-muted-foreground">
              Expires:{" "}
              <span className="font-medium">
                {new Date(url.expires_at).toLocaleString()}
              </span>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button
            size="icon"
            variant="default"
            onClick={handleCopy}
            aria-label="Copy shortened URL"
          >
            <Copy className="w-5 h-5" />
          </Button>
          <Button variant="outline" onClick={onNew}>
            Shorten another
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
