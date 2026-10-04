import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const fileDist = resolve(root, "file-dist");

await rm(fileDist, { recursive: true, force: true });
await mkdir(fileDist, { recursive: true });
await cp(resolve(root, "dist", "assets"), resolve(fileDist, "assets"), { recursive: true });

const css = await readFile(resolve(fileDist, "assets", "index.css"), "utf8");
const js = await readFile(resolve(fileDist, "assets", "index.js"), "utf8");

await writeFile(
  resolve(root, "index.html"),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Briarbrook League</title>
    <style>
${css}
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script>
${js}
    </script>
  </body>
</html>
`
);
