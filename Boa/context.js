// module.exports = {
//   get url() {
//     return this.request.url;
//   },
//   get body() {
//     return this.response.body;
//   },
//   set body(val) {
//     this.response.body = val;
//   },
//   get method() {
//     return this.request.method;
//   },
// };
const getters = ['url', 'body', 'method'],
  setters = ['body'],
  target = 'request';
const proto = {};
for (let name of getters) {
  proto.__defineGetter__(name, function () {
    return this[target][name];
  });
}
for (let name of setters) {
  proto.__defineSetter__(name, function (val) {
    return (this[target][name] = val);
  });
}
module.exports = proto;
