"use client";

import dynamic from "next/dynamic";
import { PinData } from "@/types/pin";
import { Loader2 } from "lucide-react";

const InteractiveMap = dynamic(() => import("./InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-dune-dark-950">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-dune-spice-500" />
        <span className="text-sm text-gray-400">Loading map...</span>
      </div>
    </div>
  ),
});

interface MapContainerProps {
  pins: PinData[];
  isLoading: boolean;
  activeRegion: string;
  onPinPlaced: () => void;
}

export default function MapContainer(props: MapContainerProps) {
  return (
    <div className="h-full w-full">
      <InteractiveMap {...props} />
    </div>
  );
}
