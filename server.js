import http from 'node:http';
import net from 'node:net';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const classes = path.join(here, 'backend-java', 'build', 'classes');
const mainClass = path.join(classes, 'avajet', 'erp', 'Main.class');
const port = Number(process.env.PORT || 4173);

function getAvailablePort(preferredPort) {
  return new Promise((resolve) => {
    const s = net.createServer();
    s.once('error', () => {
      const fallback = net.createServer();
      fallback.listen(0, '127.0.0.1', () => {
        const freePort = fallback.address().port;
        fallback.close(() => resolve(freePort));
      });
    });
    s.listen(preferredPort, '127.0.0.1', () => {
      const freePort = s.address().port;
      s.close(() => resolve(freePort));
    });
  });
}

async function start() {
  const javaPort = process.env.JAVA_PORT ? Number(process.env.JAVA_PORT) : await getAvailablePort(8081);

  if (!fs.existsSync(mainClass)) {
    fs.mkdirSync(classes, { recursive: true });
    const source = path.join(here, 'backend-java', 'src', 'main', 'java', 'avajet', 'erp', 'Main.java');
    const compile = spawnSync('javac', ['-encoding', 'UTF-8', '-d', classes, source], { stdio: 'inherit' });
    if (compile.error || compile.status !== 0) {
      console.error('Could not compile the Java API. Install a JDK and ensure javac is on PATH.');
      process.exit(1);
    }
  }

  const java = spawn('java', ['-Davajet.port=' + javaPort, '-cp', classes, 'avajet.erp.Main'], { stdio: 'inherit' });
  java.on('error', error => console.error('Java API failed to start:', error.message));

  const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };
  const dist = path.join(here, 'dist');
  const apiProxy = (req, res) => {
    const upstream = http.request({ hostname: '127.0.0.1', port: javaPort, path: req.url, method: req.method, headers: { ...req.headers, host: `127.0.0.1:${javaPort}` } }, response => {
      res.writeHead(response.statusCode || 502, response.headers);
      response.pipe(res);
    });
    upstream.on('error', () => { if (!res.headersSent) res.writeHead(502, { 'content-type': 'application/json' }); res.end(JSON.stringify({ error: 'Java API is unavailable. Restart the app to retry.' })); });
    req.pipe(upstream);
  };

  const server = http.createServer((req, res) => {
    if (req.url === '/health') { res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ status: 'ok', service: 'avajet-node-gateway' })); }
    if (req.url?.startsWith('/api/')) return apiProxy(req, res);
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    const relativePath = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
    const candidate = path.resolve(dist, relativePath);
    if (candidate !== dist && !candidate.startsWith(dist + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }
    const file = fs.existsSync(candidate) && fs.statSync(candidate).isFile() ? candidate : path.join(dist, 'index.html');
    fs.readFile(file, (error, data) => {
      if (error) { res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' }); return res.end('Frontend not built. Run npm run build in the project folder.'); }
      res.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
      res.end(data);
    });
  });

  server.listen(port, '127.0.0.1', () => console.log(`AVAJET ERP running at http://localhost:${port}`));
  const shutdown = () => { server.close(); java.kill(); process.exit(0); };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch(err => {
  console.error('Failed to start application:', err);
  process.exit(1);
});


