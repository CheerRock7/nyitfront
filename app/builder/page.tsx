import { Suspense } from "react";
import { BuilderClient } from "@/app/builder/builder-client";
import { getBuildParts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function BuilderPage() {
  const buildParts = await getBuildParts();
  return (
    <Suspense>
      <BuilderClient buildParts={buildParts} />
    </Suspense>
  );
}
