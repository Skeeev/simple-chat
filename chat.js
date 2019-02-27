const path = require('path');
const fs = require('fs');
const Koa = require('koa');

class Chat {
  constructor(port) {
    this._appPort = port;
  }

  run() {
    const app = new Koa();
    const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

    middlewares.forEach(middleware => require('./middlewares/' + middleware).init(app));
    this._server = app.listen(this._appPort);
  }

  stop() {
    this._server.close();
  }
}

module.exports = {
  Chat
};
