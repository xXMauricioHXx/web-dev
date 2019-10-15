const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const router = require('./http/router');
const logger = require('./logger');
const errorHandle = require('./http/middlewares/errorHandle');

class Application {
  constructor(config) {
    this.config = config;
  }

  connectDB() {
    mongoose.connect(this.config.mongoUrl, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return mongoose.connection;
  }

  start() {
    const db = this.connectDB();

    db.on('connected', () => {
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());

      app.use(router);
      app.use(errorHandle);

      app.listen(this.config.port, () => {
        logger.info(`Server running on port ${this.config.port}`);
      });
    });

    db.on('error', err => {
      throw new Error(`Fail to connect mongodb: ${err.message}`);
    });
  }
}

module.exports = Application;
