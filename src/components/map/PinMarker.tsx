"use client";

import { useState } from "react";
import { Marker, Tooltip, Popup } from "react-leaflet";
import L from "leaflet";
import { Trash2 } from "lucide-react";
import { PinData } from "@/types/pin";
import VoteButtons from "@/components/voting/VoteButtons";
import { getCategoryIconUrl } from "@/lib/icon-map";

interface PinMarkerProps {
  pin: PinData;
  currentUserId?: string;
  isAdmin?: boolean;
  onDeleted?: () => void;
}

function createPinIcon(categorySlug: string, voteScore: number) {
  const opacity = voteScore < 0 ? 0.5 : 1;
  const iconUrl = getCategoryIconUrl(categorySlug);
  return L.divIcon({
    className: "pin-marker",
    html: `<div class="pin-icon-img" style="opacity:${opacity}"><img src="${iconUrl}" alt="" width="32" height="32" /></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

export default function PinMarker({ pin, currentUserId, isAdmin, onDeleted }: PinMarkerProps) {
  const icon = createPinIcon(pin.category.slug, pin.voteScore);
  const position: L.LatLngExpression = [pin.y, pin.x];
  const [deleting, setDeleting] = useState(false);

  const canDelete = currentUserId && (pin.user.id === currentUserId || isAdmin);

  const handleDelete = async () => {
    if (!confirm("Delete this pin?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/pins/${pin.id}`, { method: "DELETE" });
      if (res.ok) {
        onDeleted?.();
      }
    } catch {
      // silently fail
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Marker position={position} icon={icon}>
      <Tooltip direction="top" offset={[0, -18]}>
        <div className="text-center">
          <div className="font-medium">{pin.category.name}</div>
          {pin.note && (
            <div className="mt-0.5 text-xs text-gray-400">{pin.note}</div>
          )}
          <div className="mt-0.5 text-xs text-gray-500">
            {pin.gridCell} &middot; {pin.voteScore > 0 ? "+" : ""}
            {pin.voteScore}
          </div>
        </div>
      </Tooltip>
      <Popup>
        <div className="min-w-[200px]">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={getCategoryIconUrl(pin.category.slug)}
                alt={pin.category.name}
                className="h-5 w-5"
              />
              <span className="font-semibold text-gray-100">
                {pin.category.name}
              </span>
            </div>
            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded p-1 text-gray-500 transition-colors hover:bg-red-900/30 hover:text-red-400 disabled:opacity-50"
                title="Delete pin"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          {pin.note && (
            <p className="mb-2 text-sm text-gray-300">{pin.note}</p>
          )}
          <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
            <span>Grid: {pin.gridCell}</span>
            <span>&middot;</span>
            <span>
              By: {pin.user.name || "Unknown"}
            </span>
          </div>
          <VoteButtons
            pinId={pin.id}
            initialScore={pin.voteScore}
            initialUserVote={pin.userVote}
          />
        </div>
      </Popup>
    </Marker>
  );
}
