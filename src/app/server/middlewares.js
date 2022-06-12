const express = require("express")
const cors = require('cors');

const initJSONMiddlwares = (app) => app.use(express.json())

const initCorsMiddlware = (app) => app.use(cors());

const initializeErrorMiddlwares = (app) => {
  app.use((err, req, res, next) => {
    if(err) {
      console.log(req.url, err)
      res.status(err.status || 500).send(err.message).end()
    }
    next()
  });
}

exports.initGlobalMiddlwares = (app) => {
  initJSONMiddlwares(app)
  initCorsMiddlware(app)
  initializeErrorMiddlwares(app)
}
