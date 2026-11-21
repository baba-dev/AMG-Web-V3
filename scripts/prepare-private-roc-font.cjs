/* Prepare optional commercially licensed Roc Regular at build time.
 * Binary never enters the public repository, CI logs, JS bundles or secrets in
 * generated HTML. In production, browser downloads remain inherent to webfonts.
 */
const fs = require("node:fs");
const path = require("node:path");
const secret = process.env.AIWA_ROC_GROTESK_WOFF2_BASE64;
const destination = path.join(__dirname, "..", "public", "fonts", "roc-grotesk-regular.woff2");

if (!secret) {
  // Remove stale files from previous local builds: without the secret, the
  // site must use the independent Space Grotesk Google Fonts fallback.
  if (fs.existsSync(destination)) fs.unlinkSync(destination);
  console.log("AIWA_FONT_SPACE_GROTESK_FALLBACK");
} else {
  const encoded = secret.replace(/\s/g, "");
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(encoded) || encoded.length % 4 !== 0) {
    throw new Error("AIWA_ROC_FONT_INVALID_BASE64");
  }
  const data = Buffer.from(encoded, "base64");
  if (data.length < 4096 || data.length > 2 * 1024 * 1024 ||
      data.toString("ascii", 0, 4) !== "wOF2" ||
      data.readUInt32BE(8) !== data.length) {
    throw new Error("AIWA_ROC_FONT_INVALID_WOFF2");
  }
  fs.mkdirSync(path.dirname(destination), {recursive:true});
  fs.writeFileSync(destination, data, {mode:0o600});
  console.log("AIWA_FONT_LICENSED_ROC_REGULAR_READY");
}
