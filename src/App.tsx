import { AllHealthPlansPage } from "./pages/AllHealthPlansPage";
import { PreviewShell } from "./preview/PreviewShell";
import { useMediaQuery } from "./hooks/useMediaQuery";

/** The preview harness needs room for a sidebar plus a device frame. */
const SHELL_UP = "(min-width: 1100px)";

export default function App() {
  const hasRoomForShell = useMediaQuery(SHELL_UP);

  // The iframe inside the harness loads this same bundle with ?embed=1 and
  // renders the bare screen. Below the shell breakpoint there is no harness —
  // the real screen simply takes the whole viewport.
  const isEmbedded = new URLSearchParams(window.location.search).has("embed");

  if (isEmbedded || !hasRoomForShell) {
    return <AllHealthPlansPage />;
  }

  return <PreviewShell />;
}
