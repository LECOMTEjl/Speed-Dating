const express = require('express');
const router = express.Router();
const HttpError = require('../services/http-error')
const guard = require('express-jwt-permissions')({
  permissionsProperty: 'roles',
});
const { generateHashedPassword } = require('../security/crypto');

const route = '/users'

const adminRole = 'ADMIN';
const roles = [[adminRole], ['MEMBER']];

const { body, validationResult } = require('express-validator');


/**
 * MiddleWares roles verifications
 * - guard.check(roles)
 * - guard.check(adminRole)
 */

router.get(route + '/', (req, res) => {
  
});

router.get(route + '/:id', (req, res) => {
  
});

router.post(route + '/', (req, res) => {
  
});

router.put(route + '/:id', (req, res) => {
  
});

router.delete(route + '/:id', (req, res) => {
  
});

exports.initializeRoutes = () => router;
