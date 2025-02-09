import http from 'node:http';

import crypto from 'node:crypto';

function generateEndpointHash(path, method) {
  const data = `${path}-${method}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

class Endpoint {
  constructor(path, method, callback) {
    this.path = path;
    this.method = method;
    this.callback = callback;
    this.hash = generateEndpointHash(path, method);
  }
}

class AppError {
  constructor(message, statusCode) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

class App {
  constructor(config = {}) {
    this.endpoints = new Map();
    this.config = config;
    this.defaultHeaders = this.config.headers || {};
  }

  createEndpoint(path, method, callback) {
    const endpoint = new Endpoint(path, method, callback);

    if (this.endpoints.has(endpoint.hash)) {
      throw new AppError('Endpoint already exists', 400);
    }

    this.endpoints.set(endpoint.hash, endpoint);
  }

  get(path, callback) {
    this.createEndpoint(path, 'GET', callback);
  }

  post(path, callback) {
    this.createEndpoint(path, 'POST', callback);
  }

  _sendErrorResponse(err, res) {
    if (err instanceof AppError) {
      res.writeHead(err.statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
      return;
    }

    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }

  init(port) {
    const server = http.createServer((req, res) => {
      for (const [headerName, headerValue] of Object.entries(this.defaultHeaders)) {
        res.setHeader(headerName, headerValue);
      }

      const { method, url } = req;
      const hash = generateEndpointHash(url, method);

      const endpoint = this.endpoints.get(hash);

      if (!endpoint) {
        this._sendErrorResponse(new AppError('Not Found', 404), res);
        return;
      }

      try {
        endpoint.callback(req, res);
      } catch (err) {
        this._sendErrorResponse(err, res);
      }
    });

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}

const app = new App({
  headers: {
    'Content-Type': 'application/json',
  }
});

app.get('/', (_, res) => {
  const data = { message: 'Hello from GET /' };
  res.end(JSON.stringify(data));
});

app.post('/users', (_, res) => {
  const data = { message: 'Hello from POST /users' };
  res.end(JSON.stringify(data));
});

app.init(3333);
