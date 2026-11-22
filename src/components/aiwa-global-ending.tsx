import { AiwaOffice } from "@/components/aiwa-office";
import { AiwaGlobalFooter } from "@/components/aiwa-footer";
import "./aiwa-polish.css";
import "./aiwa-global-ending.css";

/**
 * Persistent, site-wide closing experience. Lives in RootLayout rather than
 * individual route pages so all current and future pages inherit exactly one
 * SAY HELLO / Muscat gallery and global footer.
 */
export function AiwaGlobalEnding() {
  return (
    <div className="aiwa-site aiwa-global-ending" data-aiwa-global-ending>
      <AiwaOffice />
      <AiwaGlobalFooter />
    </div>
  );
}
