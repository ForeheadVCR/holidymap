"use client";

import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import {
  MAP_WIDTH,
  MAP_HEIGHT,
  GRID_COLS,
  GRID_ROWS,
  CELL_WIDTH,
  CELL_HEIGHT,
  ROW_LABELS_DISPLAY,
  COL_LABELS,
} from "@/lib/map-config";

export default function GridOverlay() {
  const map = useMap();

  useEffect(() => {
    // Create SVG overlay for grid lines
    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElement.setAttribute("viewBox", `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`);

    // Draw vertical lines
    for (let col = 0; col <= GRID_COLS; col++) {
      const x = col * CELL_WIDTH;
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", String(x));
      line.setAttribute("y1", "0");
      line.setAttribute("x2", String(x));
      line.setAttribute("y2", String(MAP_HEIGHT));
      line.setAttribute("stroke", "rgba(255,255,255,0.15)");
      line.setAttribute("stroke-width", "2");
      svgElement.appendChild(line);
    }

    // Draw horizontal lines
    for (let row = 0; row <= GRID_ROWS; row++) {
      const y = row * CELL_HEIGHT;
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", "0");
      line.setAttribute("y1", String(y));
      line.setAttribute("x2", String(MAP_WIDTH));
      line.setAttribute("y2", String(y));
      line.setAttribute("stroke", "rgba(255,255,255,0.15)");
      line.setAttribute("stroke-width", "2");
      svgElement.appendChild(line);
    }

    // Add cell labels
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const label = `${ROW_LABELS_DISPLAY[row]}${COL_LABELS[col]}`;
        const x = col * CELL_WIDTH + 8;
        const y = row * CELL_HEIGHT + 18;

        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        text.setAttribute("x", String(x));
        text.setAttribute("y", String(y));
        text.setAttribute("fill", "rgba(255,255,255,0.25)");
        text.setAttribute("font-size", "14");
        text.setAttribute("font-family", "monospace");
        text.setAttribute("font-weight", "600");
        text.textContent = label;
        svgElement.appendChild(text);
      }
    }

    const bounds: L.LatLngBoundsExpression = [
      [0, 0],
      [MAP_HEIGHT, MAP_WIDTH],
    ];

    const overlay = L.svgOverlay(svgElement, bounds, {
      interactive: false,
      zIndex: 400,
    });
    overlay.addTo(map);

    return () => {
      overlay.remove();
    };
  }, [map]);

  return null;
}
