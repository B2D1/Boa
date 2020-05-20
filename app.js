const Boa = require('./Boa/application');

const app = new Boa();

app.use(async (ctx, next) => {
  console.log(1);
  await next();
  console.log(5);
});
app.use(async (ctx, next) => {
  console.log(2);
  await next();
  console.log(4);
});
app.use(async (ctx, next) => {
  console.log(3);
  ctx.body = 'hello';
});

app.listen(3000, () => {
  console.log('Server starts at http://localhost:3000');
});
