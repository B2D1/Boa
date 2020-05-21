const http = require('http');
const request = require('./request');
const response = require('./response');
const context = require('./context');

class Koa {
  constructor() {
    this.request = request;
    this.response = response;
    this.context = context;
    // 存放中间件函数
    this.middleware = [];
  }
  use(fn) {
    this.middleware.push(fn);
    // 链式调用
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
    return function (context, next) {
      return dispatch(0);
      function dispatch(i) {
        let fn = middleware[i];
        //  所有中间件函数执行完毕，fn = undefined，结束递归
        if (i === middleware.length) fn = next;
        if (!fn) return Promise.resolve();
        // 递归调用下一个中间件函数
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      }
    };
  }
  respond(ctx) {
    const { res, body } = ctx;
    res.end(body === undefined ? 'Not Found' : body);
  }
  createContext(req, res) {
    // 将拓展后的请求和响应挂载到 context 上
    const context = Object.create(this.context);
    const request = (context.request = Object.create(this.request));
    const response = (context.response = Object.create(this.response));
    // 挂载原生请求、响应
    context.req = request.req = req;
    context.res = response.res = res;

    return context;
  }
}

module.exports = Koa;
