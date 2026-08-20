export interface DevicePreset {
  id: string;
  label: string;
  width: number;
  height: number;
  /** Caption under the frame. */
  caption: string;
  /** Blurb shown above the frame. */
  blurb: string;
  /** Rounded device bezel, or a flat browser-like frame. */
  bezel: boolean;
}

export const DEVICES: DevicePreset[] = [
  {
    id: "mobile",
    label: "Mobile",
    width: 360,
    height: 800,
    caption: "Mobile web · 360×800",
    blurb:
      "Mobile view — plans stack full-width and the compare action pins to the bottom of the viewport.",
    bezel: true,
  },
  {
    id: "web",
    label: "Web",
    width: 1280,
    height: 800,
    caption: "Web · 1280×800",
    blurb:
      "Desktop view — the same stacked list, centred and capped, with compare in the flow below both cards.",
    bezel: false,
  },
];

export const SCREENS = [
  { id: "all-plans", label: "All health plans" },
] as const;
