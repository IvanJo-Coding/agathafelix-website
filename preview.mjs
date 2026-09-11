// Minimal static server for previewing dist/ locally with clean-URL support.
// Mirrors how GitHub Pages serves folders: /produk-standar -> /produk-standar/index.html
import http from 'http';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const PORT = Number(process.env.PORT) || 4173;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.mp4': 'video/mp4', '.webm': 'video/webm',
};

async function resolve(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const candidates = [p];
  if (!path.extname(p)) candidates.push(p + '.html', p + '/index.html');
  for (const c of candidates) {
    const abs = path.join(DIST, c);
    if (!abs.startsWith(DIST)) continue; // path traversal guard
    try {
      const st = await fs.stat(abs);
      if (st.isFile()) return abs;
    } catch {}
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  const file = await resolve(req.url);
  if (file) {
    const body = await fs.readFile(file);
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    return res.end(body);
  }
  const notFound = path.join(DIST, '404.html');
  try {
    const body = await fs.readFile(notFound);
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    return res.end(body);
  } catch {
    res.writeHead(404); res.end('Not found');
  }
});

server.listen(PORT, () => console.log(`▶ Preview: http://localhost:${PORT}`));
