const logger = require('koa-logger');

module.exports.init = app => app.use(logger());
