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

const reqGetters = ['url', 'method'],
  resAccess = ['body'],
  proto = {};
for (let name of reqGetters) {
  proto.__defineGetter__(name, function () {
    return this['request'][name];
  });
}
for (let name of resAccess) {
  proto.__defineGetter__(name, function () {
    return this['response'][name];
  });
  proto.__defineSetter__(name, function (val) {
    return (this['response'][name] = val);
  });
}
module.exports = proto;
