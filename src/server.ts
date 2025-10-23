import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { promisify } from 'util';

const PORT = 3000;

// In-memory storage for temperature (just for demo purposes)
let currentTemp = 25.5;
function getTemperatures() {
    return [Math.random() * 30, Math.random() * 30, Math.random() * 30];
}

// Helper function to parse JSON body
const parseBody = (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
};

// Helper function to send JSON response
const sendJson = (res: ServerResponse, statusCode: number, data: any) => {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = statusCode;
  res.end(JSON.stringify(data));
};

// Create server
const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const { pathname } = parse(req.url || '/', true);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Routes
  if (pathname === '/temp' && req.method === 'GET') {
    // GET /temp - Get current temperature
    sendJson(res, 200, getTemperatures());
  } 
  else if (pathname === '/action' && req.method === 'POST') {
    // POST /action - Perform an action
    try {
      const body = await parseBody(req);
      console.log('Action received:', body);
      
      // Here you can add your action logic
      // For example, you might update some state or trigger something
      
      sendJson(res, 200, { 
        status: 'success', 
        message: 'Action completed',
        data: body 
      });
    } catch (error) {
      sendJson(res, 400, { 
        status: 'error', 
        message: 'Invalid request' 
      });
    }
  } 
  else {
    // 404 Not Found
    sendJson(res, 404, { 
      status: 'error', 
      message: 'Not Found' 
    });
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

// Handle server errors
server.on('error', (err: Error) => {
  console.error('Server error:', err);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
