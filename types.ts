export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface ColorState {
  hex: string;
  rgb: RGB;
  hsl: HSL;
}

export interface Palette {
  name: string;
  colors: string[];
}

export interface HistoryItem {
  hex: string;
  timestamp: number;
}
