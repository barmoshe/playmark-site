// Site checks: every local file the page references exists, no em dashes in copy, and the
// page has its title, description and canonical. Node built-ins only.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const full = fs.readFileSync(path.join(root, "index.html"), "utf8");
// A section marked hidden is staged work: its media may not be committed yet.
const html = full.replace(/<section[^>]*\shidden[\s>][\s\S]*?<\/section>/g, "");
const fails = [];

for (const m of html.matchAll(/(?:src|href|poster)="(\/[^"#?]*)"/g)) {
  const ref = m[1] === "/" ? "/index.html" : m[1];
  if (!fs.existsSync(path.join(root, ref))) fails.push(`missing file: ${ref}`);
}
for (const f of ["index.html", "site.js", "demo.js", "styles.css"]) {
  if (fs.readFileSync(path.join(root, f), "utf8").includes("—")) fails.push(`em dash in ${f}`);
}
for (const need of ["<title>", 'name="description"', 'rel="canonical"', 'property="og:image"']) {
  if (!html.includes(need)) fails.push(`missing ${need}`);
}

if (fails.length) {
  console.error("FAIL\n  " + fails.join("\n  "));
  process.exit(1);
}
console.log("site: all checks passed");
