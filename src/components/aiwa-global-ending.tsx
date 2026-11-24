import { AiwaGlobalFooter } from "@/components/aiwa-footer";
import "./aiwa-global-ending.css";

/**
 * Persistent, site-wide closing experience. Lives in RootLayout rather than
 * individual route pages so all current and future pages inherit exactly one
 * global footer.
 */
export function AiwaGlobalEnding() {
  return (
    <div className="aiwa-site aiwa-global-ending" data-aiwa-global-ending>
      <AiwaGlobalFooter />
    </div>
  );
}
