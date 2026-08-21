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
    width: 390,
    height: 844,
    caption: "Mobile web · 390×844",
    blurb:
      "Mobile view — plans stack full-width and the compare action pins to the bottom of the viewport.",
    bezel: true,
  },
  {
    id: "narrow",
    label: "Narrow",
    width: 360,
    height: 800,
    caption: "Narrow phone · 360×800",
    blurb:
      "The 360px floor — the narrowest width the screen supports. Type and price lines wrap harder here than on a typical phone.",
    bezel: true,
  },
  {
    id: "tablet",
    label: "Tablet",
    width: 768,
    height: 1024,
    caption: "Tablet · 768×1024",
    blurb:
      "Tablet view — past the 600px breakpoint, so compare moves into the flow below the cards and the sticky bar drops away.",
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
