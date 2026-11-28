# Development page images

Optional supporting images for `/specialisms/tech` service scenes. Drop files here on the PR branch; the page is wired to them afterwards.

## IoT & connected hardware (scene 06)

Done: the scene uses `aiwa-fluid-intelligence.svg` (light) and `aiwa-fluid-intelligence-dark.svg` (dark). To replace it with a photo or render:

- **Where:** `public/media/development/` (this folder).
- **Name:** `iot-connected-hardware.<ext>` (for example `iot-connected-hardware.png`). PNG, JPG or WebP all work; the build step converts and sizes it.
- **Shape:** landscape 16:9, at least 1600 px wide (2400 px is ideal). Keep the subject away from the edges: it is shown in a rounded frame and may be cropped slightly on phones.
- **Content:** must be original or licensed work you can publish. Real installation photos are fine only if the client approved publication. Add a line to `SOURCES.md` in this folder saying how it was made and who approved it.

The same folder and rules apply to other scenes: `cloud-devops.*`, `email-hosting.*`, `saas-business-software.*`, `web-app-development.*`, `ai-automation.*`.
