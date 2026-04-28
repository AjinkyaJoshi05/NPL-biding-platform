import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve } from "node:path";

const port = Number(process.env.FRONTEND_PORT || 5173);
const distDir = resolve("dist");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

function sendFile(res, filePath) {
  const type = contentTypes[extname(filePath)] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type });
  createReadStream(filePath).pipe(res);
}

createServer((req, res) => {
  const requestedPath = decodeURIComponent(req.url.split("?")[0]);
  let filePath = join(distDir, requestedPath === "/" ? "index.html" : requestedPath);

  if (!filePath.startsWith(distDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = join(distDir, "index.html");
  }

  sendFile(res, filePath);
}).listen(port, () => {
  console.log(`NPL frontend running on http://localhost:${port}`);
});
