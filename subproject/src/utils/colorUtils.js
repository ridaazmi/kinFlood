// Color utilities for drainage network visualization

export const CRITICITE_COLORS = {
  low: '#22c55e',    // 1-3 (vert)
  medium: '#f59e0b', // 4-6 (orange)
  high: '#ef4444',   // 7-8 (rouge)
  veryHigh: '#7c3aed', // 9-10 (violet)
};

export const ETAT_COLORS = {
  'Bon': '#22c55e',
  'Moyen': '#f59e0b',
  'Mauvais': '#ef4444',
  'Très mauvaise état': '#7c3aed',
  'Mauvais état': '#7c3aed',
  'En construction': '#3b82f6',
  'Ras': '#6b7280',
  'moyen': '#f59e0b',
};

export const URGENCE_COLORS = {
  'Urgent': '#7c3aed',
  'Très élevé': '#dc2626',
  'Élevée': '#ef4444',
  'Élevé': '#ef4444',
  'Moyen': '#f59e0b',
  'moyen': '#f59e0b',
  'Low': '#22c55e',
};

export function getCriticitColor(score) {
  if (!score) return '#6b7280';
  if (score >= 9) return '#7c3aed';
  if (score >= 7) return '#ef4444';
  if (score >= 4) return '#f59e0b';
  return '#22c55e';
}

export function getLineWidth(hierarchie) {
  switch (hierarchie) {
    case 1: return 5;
    case 2: return 3.5;
    case 3: return 2;
    default: return 2;
  }
}

// MapLibre data-driven style expression for line color by Score_Criticite
export const CRITICITE_COLOR_EXPRESSION = [
  'step',
  ['coalesce', ['get', 'Score_Criticite'], 0],
  '#22c55e', // default (0-3)
  4, '#f59e0b', // 4-6
  7, '#ef4444', // 7-8
  9, '#7c3aed'  // 9+
];

// MapLibre data-driven style expression for line width by Hierarchie
export const HIERARCHIE_WIDTH_EXPRESSION = [
  'match',
  ['coalesce', ['get', 'Hierarchie'], 3],
  1, 5,
  2, 3.5,
  3, 2,
  2
];

// Raster color scale (value 0-10 → color)
export const RASTER_COLORSCALE = [
  [0, [255, 255, 255, 0]],   // transparent
  [0.1, [173, 216, 230, 100]], // light blue
  [3, [30, 144, 255, 160]], // dodger blue
  [6, [0, 0, 205, 200]], // medium blue
  [9, [0, 0, 139, 220]], // dark blue
  [10, [0, 0, 80, 240]], // very dark blue
];

export function interpolateRasterColor(value, min, max) {
  if (value <= min || isNaN(value)) return [0, 0, 0, 0];
  const normalized = (value - min) / (max - min);

  // Heatmap gradient for flood vulnerability (YlOrRd)
  const stops = [
    { t: 0, rgba: [255, 255, 178, 0] },
    { t: 0.1, rgba: [255, 255, 178, 100] },
    { t: 0.3, rgba: [254, 204, 92, 150] },
    { t: 0.6, rgba: [253, 141, 60, 190] },
    { t: 0.85, rgba: [240, 59, 32, 220] },
    { t: 1, rgba: [189, 0, 38, 250] },
  ];

  for (let i = 0; i < stops.length - 1; i++) {
    const s0 = stops[i], s1 = stops[i + 1];
    if (normalized >= s0.t && normalized <= s1.t) {
      const ratio = (normalized - s0.t) / (s1.t - s0.t);
      return s0.rgba.map((c, k) => Math.round(c + ratio * (s1.rgba[k] - c)));
    }
  }
  return [189, 0, 38, 250];
}
