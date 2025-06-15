import { useState } from "react";
import ShortenForm from "../components/ShortenForm";
import type { UrlRead } from "../model";
import ResultCard from "../components/ResultCard";

export default function HomePage() {
  const [result, setResult] = useState<UrlRead | null>(null);

  return (
    <div className="flex flex-col gap-4 justify-center items-center flex-1">
      {result ? (
        <ResultCard url={result} onNew={() => setResult(null)} />
      ) : (
        <ShortenForm onDone={setResult} />
      )}
    </div>
  );
}
