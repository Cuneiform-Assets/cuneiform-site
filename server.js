// Simple Node.js server for development with proper MIME types for ES modules
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 8080;
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((request, response) => {
  const uri = url.parse(request.url).pathname;
  let filename = path.join(process.cwd(), uri);

  // If it's a directory, serve index.html
  if (fs.existsSync(filename) && fs.statSync(filename).isDirectory()) {
    filename += '/index.html';
  }

  fs.exists(filename, (exists) => {
    if (!exists) {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    const mimeType = mimeTypes[path.extname(filename)] || 'application/octet-stream';
    
    // Add CORS headers for development
    response.writeHead(200, {
      "Content-Type": mimeType,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });

    const fileStream = fs.createReadStream(filename);
    fileStream.pipe(response);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});