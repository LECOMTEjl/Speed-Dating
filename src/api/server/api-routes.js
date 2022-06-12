const express = require('express');
const router = express.Router();

const userRoutes = require('../controllers/user.routes')
const authRoutes = require('../controllers/auth.routes')
const meetRoutes = require('../controllers/meet.routes')

const route = '/api'

router.use(route, userRoutes.initializeRoutes())
router.use(route, authRoutes.initializeRoutes())
router.use(route, meetRoutes.initializeRoutes())

exports.initializeRoutes = () => router