const express = require('express');
const router = express.Router();
const path = require('path')

const route = '/app'

router.use(route, express.static(path.join(__dirname,'../web-app')))

// PAGES
router.get(route, (req, res) => res.sendFile(path.join(__dirname, '../web-app/routes/main/main.html')))

router.get(route + '/login', (req, res) => res.sendFile(path.join(__dirname, '../web-app/routes/auth/login/login.html')))

router.get(route + '/subscribe', (req, res) => res.sendFile(path.join(__dirname, '../web-app/routes/auth/subscribe/subscribe.html')))

router.get(route + '/user/:id', (req, res) => res.sendFile(path.join(__dirname, '../web-app/routes/user/user.html')))

// favicon
router.get('/favicon.ico', (req, res) => res.sendFile(path.join(__dirname, '../web-app/assets/favicon.ico')))

// Other routes redirect to main
router.get(/.*/, (req, res) => res.redirect(route))


exports.initializeRoutes = () => router