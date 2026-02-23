"use client";

import { Marker, Tooltip, Popup } from "react-leaflet";
import L from "leaflet";
import { PinData } from "@/types/pin";
import VoteButtons from "@/components/voting/VoteButtons";

interface PinMarkerProps {
  pin: PinData;
}

function createPinIcon(color: string, voteScore: number) {
  const opacity = voteScore < 0 ? 0.5 : 1;
  return L.divIcon({
    className: "pin-marker",
    html: `<div class="pin-icon" style="background:${color};opacity:${opacity}"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

export default function PinMarker({ pin }: PinMarkerProps) {
  const icon = createPinIcon(pin.category.color, pin.voteScore);
  const position: L.LatLngExpression = [pin.y, pin.x];

  return (
    <Marker position={position} icon={icon}>
      <Tooltip direction="top" offset={[0, -16]}>
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
          <div className="mb-2 flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: pin.category.color }}
            />
            <span className="font-semibold text-gray-100">
              {pin.category.name}
            </span>
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
