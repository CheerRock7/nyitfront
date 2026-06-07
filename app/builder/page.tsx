import { Suspense } from "react";
import { BuilderClient } from "@/app/builder/builder-client";

export default function BuilderPage() {
  return (
    <Suspense>
      <BuilderClient />
    </Suspense>
  );
}
