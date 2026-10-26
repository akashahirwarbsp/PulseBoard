import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT) || 4173;
const mimeTypes = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml", ".json": "application/json; charset=utf-8", ".ico": "image/x-icon"
};

const server = http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url || "/", `http://${request.headers.host || "localhost"}`).pathname);
    const requestedPath = pathname === "/" ? "/index.html" : pathname;
    const absolutePath = path.resolve(root, `.${requestedPath}`);
    if (absolutePath !== root && !absolutePath.startsWith(`${root}${path.sep}`)) {
      response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" }).end("Forbidden");
      return;
    }
    const info = await stat(absolutePath);
    if (!info.isFile()) throw new Error("Not a file");
    const body = await readFile(absolutePath);
    response.writeHead(200, { "Content-Type": mimeTypes[path.extname(absolutePath)] || "application/octet-stream", "X-Content-Type-Options": "nosniff" });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`PulseBoard is running at http://127.0.0.1:${port}`);
  console.log("Press Ctrl+C to stop the local server.");
});
