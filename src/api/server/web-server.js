const express = require('express')

const { initGlobalMiddlwares } = require('./middlewares')
const apiRouter = require('./api-routes')

class WebServer {
  app = undefined;
  port = 3001;
  server = undefined
  
  constructor() {
    this.app = express();

    initGlobalMiddlwares(this.app)
    
    this.app.use(apiRouter.initializeRoutes())
  }

  start() {
    this.server = this.app.listen(this.port, () => {
      console.log(`Api listening on port ${this.port}`);
    });
  }

  stop() {
    this.server.close()
  }
}

module.exports = WebServer;