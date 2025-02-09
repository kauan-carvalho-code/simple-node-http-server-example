import http from 'http';

class Endpoint {
  constructor(path, method, callback) {
    this.path = path;
    this.method = method;
    this.callback = callback;
    this.regex = this.#generateRegex(path);
  }

  #generateRegex(path) {
    const parametersRegex = /:([a-zA-Z]+)/g;
    const pathWithParameters = path.replaceAll(parametersRegex, '(?<$1>[a-zA-Z0-9\\-_]+)');
    return new RegExp(`^${pathWithParameters}(?<query>\\?(.*))?$`);
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
    this.endpoints = [];
    this.config = config;
    this.defaultHeaders = this.config.headers || {};
  }

  #createEndpoint(path, method, callback) {
    const endpoint = new Endpoint(path, method, callback);

    if (this.endpoints.some(e => e.path === path && e.method === method)) {
      throw new AppError(`Endpoint ${method} ${path} already exists`, 400);
    }

    this.endpoints.push(endpoint);
  }

  get(path, callback) {
    this.#createEndpoint(path, 'GET', callback);
  }

  post(path, callback) {
    this.#createEndpoint(path, 'POST', callback);
  }

  put(path, callback) {
    this.#createEndpoint(path, 'PUT', callback)
  }

  patch(path, callback) {
    this.#createEndpoint(path, 'PATCH', callback)
  }

  delete(path, callback) {
    this.#createEndpoint(path, 'DELETE', callback);
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

  #extractQueryParams(query) {
    if (!query) {
      return {}
    }

    return query.substr(1).split('&').reduce((acc, curr) => {
      const [key, value] = curr.split('=');

      acc[key] = value;

      return acc
    }, {})
  }

  #extractParams(req, endpoint) {
    const match = req.url.match(endpoint.regex)

    const { query, ...params } = match?.groups 

    req.params = params
    req.query = this.#extractQueryParams(query)
  }

  init(port) {
    const server = http.createServer(async (req, res) => {
      for (const [headerName, headerValue] of Object.entries(this.defaultHeaders)) {
        res.setHeader(headerName, headerValue);
      }

      const { method, url } = req;

      const endpoint = this.endpoints.find(endpoint => {
        return endpoint.method === method && endpoint.regex.test(url)
      });

      if (!endpoint) {
        this.#sendErrorResponse(new AppError('Not Found', 404), res);
        return;
      }

      this.#extractParams(req, endpoint)

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
