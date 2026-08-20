import { Button } from "@acko/button";
import { Typography } from "@acko/typography";
import { Messages, Phone } from "@acko/icons";
import { ResponsiveSheet } from "./ResponsiveSheet";

interface ContactSheetProps {
  open: boolean;
  onClose: () => void;
}

const SUPPORT_NUMBER = "1800 266 2256";

/**
 * Contact options behind the "Chat or call" pill. Two full-width library
 * Buttons rather than custom rows, so there is nothing bespoke here.
 */
export function ContactSheet({ open, onClose }: ContactSheetProps) {
  return (
    <ResponsiveSheet
      open={open}
      onClose={onClose}
      title="Chat or call"
      description="Our health experts can walk you through the plans"
    >
      <div className="flex flex-col gap-12">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          iconLeft={<Messages aria-hidden="true" />}
          onClick={onClose}
        >
          Chat with an expert
        </Button>

        {/* Button renders a <button> with no href/as escape hatch, so the dial
            action has to be scripted rather than a real tel: anchor. */}
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          iconLeft={<Phone aria-hidden="true" />}
          onClick={() => {
            window.location.href = `tel:${SUPPORT_NUMBER.replace(/\s/g, "")}`;
          }}
        >
          Call {SUPPORT_NUMBER}
        </Button>

        <Typography variant="caption" color="secondary" align="center">
          Available 9 am to 9 pm, all days
        </Typography>
      </div>
    </ResponsiveSheet>
  );
}
