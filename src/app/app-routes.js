const express = require('express');
const router = express.Router();
const path = require('path')

const route = '/app'

router.use(route, express.static(path.join(__dirname,'/web-app')))

router.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, '/web-app/routes/list/list.html'))
});

router.get(route + '/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/web-app/routes/auth/login/login.html'))
});

router.get(route + '/subscribe', (req, res) => {
    res.sendFile(path.join(__dirname, '/web-app/routes/auth/subscribe/subscribe.html'))
});

router.get(/.?/, (req, res) => {
    res.redirect(route)
});

exports.initializeRoutes = () => router