import TypingResultDetails from "@/components/typing/TypingResultDetails";
import { Suspense } from "react";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold">Loading Report...</div>}>
      <TypingResultDetails params={resolvedParams} />
    </Suspense>
  );
}
