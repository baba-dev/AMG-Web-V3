import assert from "node:assert/strict";
import { buildWall, stations, stationAt } from "../src/lib/development-wall.ts";

const slugs = ["aiwa-creators","gwi","fxrco","menu-minute","bababuilds-erp","healthzone-oman","ezvesto","tribe-oman","the-gulf-post","aqua-petro-chemicals","best-appliances","falcon-logistics","flydestini","bababuilds","rcs-oman","sohar-ods","strategic-catering","xspiceo"];
const wall = buildWall(slugs, 6);
assert.equal(wall.length, 18, "one tile per slug");
assert.equal(new Set(wall.map(t => t.slug)).size, 18, "unique slugs");
assert.equal(new Set(wall.map(t => `${t.x}:${t.y}`)).size, 18, "unique x/y cells");
assert.deepEqual(buildWall(slugs, 6), wall, "deterministic");
assert.equal(stations.length, 6);
assert.deepEqual(stations.map(s => s.id), ["web","software","cloud","email","ai","iot"]);
stations.forEach((s, i) => {
  assert.ok(s.at >= 0 && s.at <= 1, "at within 0..1");
  if (i) assert.ok(s.at > stations[i - 1].at, "at strictly ascending");
});
assert.equal(stationAt(-1), "web");
assert.equal(stationAt(2), "iot");
assert.equal(stationAt(stations[2].at), "cloud");
const featured = id => stations.find(s => s.id === id).featured;
assert.deepEqual(featured("web"), ["gwi"]);
assert.deepEqual(featured("software"), ["bababuilds-erp"]);
assert.deepEqual(featured("ai"), ["aiwa-creators"]);
for (const id of ["cloud","email","iot"]) assert.deepEqual(featured(id), [], id + " has no client tile");
console.log("TECH_WALL_DATA_PASS");
