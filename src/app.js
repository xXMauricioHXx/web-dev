const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./http/router');
const logger = require('./logger');
const errorHandle = require('./http/middlewares/errorHandle');

class Application {
  constructor(config) {
    this.config = config;
  }

  start() {
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    
    app.use(router);
    app.use(errorHandle);
    
    app.listen(this.config.port, () => {
      logger.info(`Server running on port ${this.config.port}`);
    });
  }
}

module.exports = Application;