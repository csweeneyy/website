const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DIR = __dirname;

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg', '.txt': 'text/plain', '.mp4': 'video/mp4',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  // Save pins endpoint — writes directly to pins.json
  if (req.method === 'POST' && req.url === '/save-pins') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      fs.writeFileSync(path.join(DIR, 'pins.json'), body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{"ok":true}');
      console.log('  ✓ pins.json saved');
    });
    return;
  }

  // Auto-discover new photos when requesting pins.json
  if (req.method === 'GET' && req.url.startsWith('/pins.json')) {
    const pinsPath = path.join(DIR, 'pins.json');
    const photosPath = path.join(DIR, 'travel-photos');
    
    let pins = [];
    try { pins = JSON.parse(fs.readFileSync(pinsPath, 'utf8')); } catch(e) {}
    
    let photos = [];
    try { photos = fs.readdirSync(photosPath).filter(f => !f.startsWith('.')); } catch(e) {}
    
    let added = false;
    photos.forEach(photo => {
      if (!pins.find(p => p.image === photo)) {
        pins.push({
          image: photo,
          caption: photo.split('.')[0].replace(/-/g, ' '),
          pin: { x: 50, y: 50 },
          coord: { x: 50, y: 50 },
          size: { w: 60, h: 40 }
        });
        added = true;
        console.log(`  + Auto-added new photo: ${photo}`);
      }
    });

    if (added) fs.writeFileSync(pinsPath, JSON.stringify(pins, null, 2));
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(pins));
    return;
  }

  // Static file serving
  let file = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const filePath = path.join(DIR, decodeURIComponent(file));
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err && !ext) {
      // Try .html fallback for extensionless URLs (e.g. /travel → /travel.html)
      const htmlPath = filePath + '.html';
      fs.readFile(htmlPath, (err2, data2) => {
        if (err2) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data2);
      });
      return;
    }
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => console.log(`Dev server running → http://localhost:${PORT}`));
