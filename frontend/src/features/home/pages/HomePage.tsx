import { useState } from "react";
import ShortenForm from "../components/ShortenForm";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [isShorten, setIsShorten] = useState(true);

  if (isShorten) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center flex-1">
        <ShortenForm handler={setIsShorten} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center flex-1">
      Result Card <Button onClick={() => setIsShorten(true)}>Shorten Another</Button>
    </div>
  );
}
