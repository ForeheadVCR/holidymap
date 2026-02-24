"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import {
  MapContainer,
  ImageOverlay,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { signIn, useSession } from "next-auth/react";
import { PinData } from "@/types/pin";
import Toast from "@/components/ui/Toast";
import {
  MAP_BOUNDS,
  MAP_WIDTH,
  MAP_HEIGHT,
  pixelToGridCell,
} from "@/lib/map-config";
import PinMarker from "./PinMarker";
import PinPlacementModal from "./PinPlacementModal";
import GridOverlay from "./GridOverlay";

interface InteractiveMapProps {
  pins: PinData[];
  isLoading: boolean;
  activeRegion: string;
  onPinPlaced: () => void;
  currentUserId?: string;
  canEdit?: boolean;
  isAdmin?: boolean;
  onPinDeleted?: () => void;
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (latlng: L.LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

function MapResizer() {
  const map = useMap();
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = map.getContainer();
    containerRef.current = container;

    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [map]);

  return null;
}

export default function InteractiveMap({
  pins,
  activeRegion,
  onPinPlaced,
  currentUserId,
  isAdmin,
  onPinDeleted,
}: InteractiveMapProps) {
  const { data: session } = useSession();
  const [placementCoords, setPlacementCoords] = useState<{
    x: number;
    y: number;
    gridCell: string;
  } | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    showSignIn?: boolean;
  } | null>(null);

  const handleMapClick = useCallback(
    (latlng: L.LatLng) => {
      if (!session) {
        setToast({
          message: "You must sign in with Discord to add locations",
          showSignIn: true,
        });
        return;
      }

      if (!session.user?.canEdit) {
        setToast({
          message: "You need the Watersealed role to add locations",
        });
        return;
      }

      const x = latlng.lng;
      const y = latlng.lat;

      // Check bounds
      if (x < 0 || x > MAP_WIDTH || y < 0 || y > MAP_HEIGHT) return;

      const gridCell = pixelToGridCell(x, y);
      setPlacementCoords({ x, y, gridCell });
    },
    [session]
  );

  const handlePinPlaced = useCallback(() => {
    setPlacementCoords(null);
    onPinPlaced();
  }, [onPinPlaced]);

  return (
    <>
      <MapContainer
        center={[MAP_HEIGHT / 2, MAP_WIDTH / 2]}
        zoom={-1}
        minZoom={-2}
        maxZoom={3}
        crs={L.CRS.Simple}
        style={{ height: "100%", width: "100%" }}
        maxBounds={[
          [-200, -200],
          [MAP_HEIGHT + 200, MAP_WIDTH + 200],
        ]}
        maxBoundsViscosity={1.0}
        zoomControl={true}
        attributionControl={false}
      >
        <MapResizer />
        <ImageOverlay url="/map/deep-desert-grid.png" bounds={MAP_BOUNDS} />
        <GridOverlay />
        <MapClickHandler onMapClick={handleMapClick} />

        {pins.map((pin) => (
          <PinMarker
            key={pin.id}
            pin={pin}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
            onDeleted={onPinDeleted}
          />
        ))}
      </MapContainer>

      {placementCoords && (
        <PinPlacementModal
          x={placementCoords.x}
          y={placementCoords.y}
          gridCell={placementCoords.gridCell}
          activeRegion={activeRegion}
          onClose={() => setPlacementCoords(null)}
          onPlaced={handlePinPlaced}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          action={
            toast.showSignIn
              ? {
                  label: "Sign in with Discord",
                  onClick: () => signIn("discord"),
                }
              : undefined
          }
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  );
}
