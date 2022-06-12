const express = require('express')

const { initGlobalMiddlwares } = require('./middlewares')
const appRouter = require('./app-routes')

class WebServer {
  app = undefined;
  port = 3000;
  server = undefined
  
  constructor() {
    this.app = express();

    initGlobalMiddlwares(this.app)
    
    this.app.use(appRouter.initializeRoutes())
  }

  start() {
    this.server = this.app.listen(this.port, () => {
      console.log(`App listening on port ${this.port}`);
    });
  }

  stop() {
    this.server.close()
  }
}

module.exports = WebServer;