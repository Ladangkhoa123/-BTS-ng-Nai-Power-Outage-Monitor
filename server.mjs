import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(root, 'Index.html'), 'utf8')
  .replace('<?!= include(\'CSS\'); ?>', fs.readFileSync(path.join(root, 'CSS.html'), 'utf8'))
  .replace('<?!= include(\'JavaScript\'); ?>', fs.readFileSync(path.join(root, 'JavaScript.html'), 'utf8'));

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/Index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

const port = Number(process.env.PORT || 8080);
server.listen(port, '127.0.0.1', () => {
  console.log(`BTS local preview: http://localhost:${port}`);
});
