const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Environment variables
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT, 10) || 3000;

// Handle process signals
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

// Prepare the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

console.log('Starting Next.js application...');
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Node version: ${process.version}`);

app.prepare().then(() => {
  console.log('Next.js app prepared successfully');
  
  createServer(async (req, res) => {
    try {
      // Parse the URL
      const parsedUrl = parse(req.url, true);
      
      // Handle the request
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  })
  .once('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  })
  .listen(port, () => {
    console.log(`> Server ready on http://${hostname}:${port}`);
    console.log(`> Environment: ${process.env.NODE_ENV}`);
  });
}).catch((err) => {
  console.error('Failed to start Next.js app:', err);
  process.exit(1);
});