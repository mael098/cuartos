import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { promisify } from 'util';
import { SerialPort, ReadlineParser } from 'serialport'
import { randomUUID } from "node:crypto"

const portName = 'COM4'

export const port = new SerialPort({
    path: portName,
    baudRate: 9600
})

export const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))

port.on('error', err => {
    console.error('Error:', err.message)
})

port.on('open', () => {
    console.log(`Conectado al puerto ${portName}`)
})

export function getTemp() {
    const { promise, reject, resolve } = Promise.withResolvers<[number,number,number]>()

    const id = randomUUID()
    port.write(`get_temp:${id}\n`);

    const listener = (chunk: string) => {
        const data = JSON.parse(chunk)

        if (data.event !== 'get_temp' || data.id !== id) return 

        resolve(data.data)
        parser.removeListener('data', listener)
    }

    parser.on('data', listener)
    setTimeout(() => {
        reject(new Error('Time end'))
        parser.removeListener('data', listener)
    }, 3_000)

    return promise
}

const PORT = 8080;

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
    try {
      sendJson(res, 200, await getTemp());
    } catch (error) {
      console.error(error);
      sendJson(res, 200, [0,0,0]);
    }
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
