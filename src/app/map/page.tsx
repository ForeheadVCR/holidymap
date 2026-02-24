import { Suspense } from "react";
import MapPageClient from "./MapPageClient";

export const dynamic = "force-dynamic";

export default function MapPage() {
  return (
    <Suspense>
      <MapPageClient />
    </Suspense>
  );
}
