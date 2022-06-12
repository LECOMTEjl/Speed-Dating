require('dotenv').config();
const WebServer = require('./server/web-server');

const webServer = new WebServer();
webServer.start();
