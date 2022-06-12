const express = require("express")
const cors = require('cors');
const jwt = require('express-jwt')

const PUBLIC_ROUTES = [
  '/api/login',
  '/api/subscribe',
  '/favicon.ico'
]

const initJSONMiddlwares = (app) => app.use(express.json())

const initJWTMiddlware = (app) => app.use(jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }).unless({ path: PUBLIC_ROUTES }));

const initCorsMiddlware = (app) => app.use(cors());

const initializeErrorMiddlwares = (app) => {
  app.use((err, req, res, next) => {
    if(err) {
      console.log(req.url, err)
      return res.status(err.status || 500).send(err.message).end()
    }
    next()
  });
}

exports.initGlobalMiddlwares = (app) => {
  initCorsMiddlware(app)
  initJWTMiddlware(app)
  initJSONMiddlwares(app)
  initializeErrorMiddlwares(app)
}
