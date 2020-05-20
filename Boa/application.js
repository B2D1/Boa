const http = require('http');
const request = require('./request');
const response = require('./response');
const context = require('./context');

class Boa {
  constructor() {
    this.request = request;
    this.response = response;
    this.context = context;
    this.middleware = [];
  }
  use(fn) {
    this.middleware.push(fn);
    return this;
  }
  listen(...args) {
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }
  callback() {
    const fn = this.compose(this.middleware);
    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };
    return handleRequest;
  }
  handleRequest(ctx, fnMiddleware) {
    const handleResponse = () => this.respond(ctx);
    return fnMiddleware(ctx).then(handleResponse);
  }
  compose(middleware) {
    return function (context) {
      return dispatch(0);
      function dispatch(i) {
        const fn = middleware[i];
        if (!fn) return Promise.resolve();
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      }
    };
  }
  respond(ctx) {
    const { res, body } = ctx;
    res.end(body);
  }
  createContext(req, res) {
    // 将请求和响应拥有的方法挂载在context上
    const context = Object.create(this.context);
    const request = (context.request = Object.create(this.request));
    const response = (context.response = Object.create(this.response));
    // 挂载原生请求、响应
    context.req = request.req = req;
    context.res = response.res = res;

    return context;
  }
}

module.exports = Boa;
