import http from 'http'

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

export class App {
  constructor(config = {}) {
    this.endpoints = new Map();
    this.config = config;
    this.defaultHeaders = this.config.headers || {};
  }

  #createEndpoint(path, method, callback) {
    const endpoint = new Endpoint(path, method, callback);

    if (this.endpoints.has(endpoint.hash)) {
      throw new AppError('Endpoint already exists', 400);
    }

    this.endpoints.set(endpoint.hash, endpoint);
  }

  get(path, callback) {
    this.#createEndpoint(path, 'GET', callback);
  }

  post(path, callback) {
    this.#createEndpoint(path, 'POST', callback);
  }

   #sendErrorResponse(err, res) {
    if (err instanceof AppError) {
      res.writeHead(err.statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
      return;
    }

    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }

  async #parseJSONBody(req) {
    const buffers = [];

    for await (const chunk of req) {
      buffers.push(chunk);
    }

    try {
      req.body = JSON.parse(Buffer.concat(buffers).toString());
    } catch {
      req.body = {};
    }
  }

  init(port) {
    const server = http.createServer(async (req, res) => {
      for (const [headerName, headerValue] of Object.entries(this.defaultHeaders)) {
        res.setHeader(headerName, headerValue);
      }

      const { method, url } = req;
      const hash = generateEndpointHash(url, method);

      const endpoint = this.endpoints.get(hash);

      if (!endpoint) {
        this.#sendErrorResponse(new AppError('Not Found', 404), res);
        return;
      }

      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        await this.#parseJSONBody(req);
      }

      try {
        endpoint.callback(req, res);
      } catch (err) {
        this.#sendErrorResponse(err, res);
      }
    });

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
