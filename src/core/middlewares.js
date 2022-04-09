const express = require("express")
const { DateTime } = require('luxon');
const cors = require('cors');
const jwt = require('express-jwt')

const PUBLIC_ROUTES = [
  '/api/login',
  '/api/subscribe',
  '/favicon.ico',
  /app\/?.?/i
]

/*const initLoggerMiddlware = (app) => {
  app.use((req, res, next) => {
    const begin = new DateTime(new Date());

    res.on('finish', () => {
      const requestDate = begin.toString();
      const remoteIP = `IP: ${req.connection.remoteAddress}`;
      const httpInfo = `${req.method} ${req.baseUrl || req.path}`;

      const end = new DateTime(new Date());
      const requestDurationMs = end.diff(begin).toMillis();
      const requestDuration = `Duration: ${requestDurationMs}ms`;

      console.log(`[${requestDate}] - [${remoteIP}] - [${httpInfo}] - [${requestDuration}]`);
    })
    next();
  });
};*/

const initJSONMiddlwares = (app) => app.use(express.json())

const initJWTMiddlware = (app) => app.use(jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }).unless({ path: PUBLIC_ROUTES }));

const initCorsMiddlware = (app) => app.use(cors());

const initializeErrorMiddlwares = (app) => {
  app.use((err, req, res, next) => {
    console.log(req.url)
    console.log(err)
    res.status(500).send(err.message);
  });
}

exports.initGlobalMiddlwares = (app) => {
  //initLoggerMiddlware(app)
  initJSONMiddlwares(app)
  initJWTMiddlware(app)
  initCorsMiddlware(app)
  initializeErrorMiddlwares(app)
}
