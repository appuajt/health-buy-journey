import type { ReactNode } from "react";
import { Dialog } from "@acko/dialog";
import { Drawer } from "@acko/drawer";
import { TABLET_UP, useMediaQuery } from "../hooks/useMediaQuery";

interface ResponsiveSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

/**
 * Overlay surface that downshifts with the viewport: a centred Dialog from
 * tablet up, a bottom Drawer on mobile for one-thumb reach
 * (responsiveness.md §3 — "Centered modal → Bottom sheet").
 *
 * Both are real ACKO packages, not a resized modal.
 */
export function ResponsiveSheet({
  open,
  onClose,
  title,
  description,
  footer,
  children,
}: ResponsiveSheetProps) {
  const isTabletUp = useMediaQuery(TABLET_UP);

  if (isTabletUp) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        title={title}
        description={description}
        size="md"
        footer={footer}
      >
        {children}
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="bottom"
      size="lg"
      title={title}
      description={description}
      footer={footer}
    >
      {children}
    </Drawer>
  );
}
