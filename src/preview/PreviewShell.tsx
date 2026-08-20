import { useEffect, useRef, useState } from "react";
import { Button } from "@acko/button";
import { Typography } from "@acko/typography";
import { ToggleGroup, ToggleGroupItem } from "@acko/toggle";
import { DEVICES, SCREENS } from "./devices";

const ACKO_LOGO =
  "https://pub-c050457d48794d5bb9ffc2b4649de2c1.r2.dev/ACKO%20logo%20horizontal%20Light%20BG.svg";

/**
 * Presentation harness for reviewing the screen at different device sizes —
 * not part of the product. Only rendered above 1024px; below that the app
 * takes over the whole viewport, which is the real thing anyway.
 *
 * The screen renders inside an <iframe> rather than a scaled-down div, so its
 * media queries and `position: fixed` chrome (the sticky compare bar, the
 * support pill) resolve against the frame's own viewport. A CSS-scaled div
 * would report the desktop width to the breakpoints and let fixed elements
 * escape to the real viewport — the preview would be a lie.
 */
export function PreviewShell() {
  const [deviceId, setDeviceId] = useState(DEVICES[0].id);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);

  const device = DEVICES.find((d) => d.id === deviceId) ?? DEVICES[0];

  // Scale the frame down when the stage can't fit it at 1:1, so the desktop
  // preview stays whole on a laptop screen.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const fit = () => {
      const available = stage.clientWidth - 48;
      setScale(Math.min(1, available / device.width));
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(stage);

    return () => observer.disconnect();
  }, [device.width]);

  const frameSrc = `${window.location.pathname}?embed=1`;

  return (
    <div className="preview-shell">
      <aside className="preview-sidebar">
        <div className="flex flex-col gap-24">
          <div className="flex flex-col gap-8">
            <img src={ACKO_LOGO} alt="ACKO" className="h-24 w-auto self-start" />
            <Typography variant="body-md" color="secondary">
              Health buy journey
            </Typography>
          </div>

          <div className="flex flex-col gap-8">
            <Typography variant="overline" color="secondary">
              View
            </Typography>
            <ToggleGroup
              type="single"
              value={deviceId}
              onValueChange={(value) => {
                if (typeof value === "string" && value) setDeviceId(value);
              }}
              size="md"
              className="flex-col items-stretch"
            >
              {DEVICES.map((option) => (
                <ToggleGroupItem key={option.id} value={option.id}>
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="flex flex-col gap-8">
            <Typography variant="overline" color="secondary">
              Screens
            </Typography>
            {SCREENS.map((screen) => (
              <Button key={screen.id} variant="primary" size="md" fullWidth>
                {screen.label}
              </Button>
            ))}
          </div>
        </div>

        <Typography variant="caption" color="secondary">
          Screen 14 · all-plans-platinum
        </Typography>
      </aside>

      <main className="preview-stage" ref={stageRef}>
        <div className="flex flex-col gap-4">
          <Typography variant="heading-sm" weight="semibold" as="h1">
            All health plans
          </Typography>
          <Typography variant="body-sm" color="secondary">
            {device.blurb}
          </Typography>
        </div>

        <div
          className="preview-frame-space"
          style={{ height: device.height * scale }}
        >
          <div
            className={device.bezel ? "preview-frame preview-frame--bezel" : "preview-frame"}
            style={{
              width: device.width,
              height: device.height,
              transform: `scale(${scale})`,
            }}
          >
            <iframe
              key={device.id}
              src={frameSrc}
              title={`All health plans — ${device.label} preview`}
              width={device.width}
              height={device.height}
            />
          </div>
        </div>

        <Typography variant="caption" color="secondary" align="center">
          {device.caption}
          {scale < 1 ? ` · shown at ${Math.round(scale * 100)}%` : null}
        </Typography>
      </main>
    </div>
  );
}
