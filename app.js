const fs = require('fs');
const promisify = require('util').promisify;
const Koa = require('./lib/application');

const app = new Koa();

const readTxt = async (ctx, next) => {
  const promisifyReadFile = promisify(fs.readFile);
  const data = await promisifyReadFile('./demo.txt', { encoding: 'utf8' });
  next();
  return data ? data : 'no content';
};

app
  .use(async (ctx, next) => {
    console.log('start');
    await next();
    console.log('end');
  })
  .use(async (ctx, next) => {
    const data = await next();
    ctx.body = data;
  })
  .use(readTxt);

app.listen(3000, () => {
  console.log('Server starts at http://localhost:3000');
});
