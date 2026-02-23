export const MAP_WIDTH = 2048;
export const MAP_HEIGHT = 2048;

export const GRID_COLS = 9;
export const GRID_ROWS = 9;
export const CELL_WIDTH = MAP_WIDTH / GRID_COLS;
export const CELL_HEIGHT = MAP_HEIGHT / GRID_ROWS;

export const ROW_LABELS = ["I", "H", "G", "F", "E", "D", "C", "B", "A"];
export const COL_LABELS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

// For display in sidebar (A at top, I at bottom)
export const ROW_LABELS_DISPLAY = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

// Leaflet bounds: [southWest, northEast] using CRS.Simple [y, x]
export const MAP_BOUNDS: [[number, number], [number, number]] = [
  [0, 0],
  [MAP_HEIGHT, MAP_WIDTH],
];

/**
 * Convert pixel coordinates to grid cell label.
 * In Leaflet CRS.Simple: y=0 is bottom of image, y=MAP_HEIGHT is top.
 * Row A is the top (highest y), Row I is the bottom (lowest y).
 * Col 1 is the left (lowest x), Col 9 is the right (highest x).
 */
export function pixelToGridCell(x: number, y: number): string {
  const col = Math.min(Math.max(Math.floor(x / CELL_WIDTH), 0), GRID_COLS - 1);
  const row = Math.min(
    Math.max(Math.floor((MAP_HEIGHT - y) / CELL_HEIGHT), 0),
    GRID_ROWS - 1
  );
  return `${ROW_LABELS_DISPLAY[row]}${COL_LABELS[col]}`;
}

/**
 * Get the center pixel coordinates of a grid cell (in Leaflet CRS.Simple coords).
 */
export function gridCellToPixel(cell: string): { x: number; y: number } {
  const rowLabel = cell[0].toUpperCase();
  const colLabel = cell.substring(1);
  const row = ROW_LABELS_DISPLAY.indexOf(rowLabel);
  const col = COL_LABELS.indexOf(colLabel);
  if (row === -1 || col === -1) return { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 };
  return {
    x: col * CELL_WIDTH + CELL_WIDTH / 2,
    y: MAP_HEIGHT - (row * CELL_HEIGHT + CELL_HEIGHT / 2),
  };
}
