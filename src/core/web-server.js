const express = require('express')

const { initGlobalMiddlwares } = require('../core/middlewares')
const apiRouter = require('../api/api-routes')
const appRouter = require('../app/app-routes')

class WebServer {
  app = undefined;
  port = 3000;
  server = undefined
  
  constructor() {
    this.app = express();

    initGlobalMiddlwares(this.app)
    this.app.use(apiRouter.initializeRoutes())
    this.app.use(appRouter.initializeRoutes())
  }

  start() {
    this.server = this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
  }

  stop() {
    this.server.close()
  }
}

module.exports = WebServer;