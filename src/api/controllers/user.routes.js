const express = require('express');
const router = express.Router();
const guard = require('express-jwt-permissions')({
    permissionsProperty: 'role',
});
const { verifyAuthToken } = require('../security/auth')
const Users = require('../models/DAOUsers')

const route = '/users'

const adminRole = 'ADMIN';
const roles = [[adminRole], ['MEMBER']];


const getSubscriber = (authorization) => {
    var user
    try {
        user = verifyAuthToken(authorization)
    }
    catch (e) {
        console.log(e)
    }
    return user
}

router.get(route,
    guard.check(roles),
    (req, res) => {

    var subscriber = getSubscriber(req.headers.authorization)
    if (!subscriber) return res.sendStatus(401)

    Users.getAllBySubscriberID(subscriber.id)
    .then((user) => res.status(200).json(user) )
    .catch((err) => {
        console.log('Error : Users.getAllBySubscriberID', err)
        res.sendStatus(500)
    })
});

router.get(route + '/:id',
    guard.check(roles),
    (req, res) => {

    const id = +req.params.id

    Users.findByID(id)
    .then(user => res.status(200).json(user[0]) )
    .catch((err) => {
        console.log('Error : Users.findByID', err)
        res.sendStatus(500)
    })
});

router.post(route,
    guard.check(roles),
    (req, res) => {

    var subscriber = getSubscriber(req.headers.authorization)
    if (!subscriber) return res.sendStatus(401)

    const { firstName, lastName, gender, birthday, note } = req.body

    Users.add(subscriber.id, firstName, lastName, gender, birthday, note)
    .then(user => res.status(201).send({}))
    .catch(err => {
        console.log('Error : Users.add', err)
        res.sendStatus(500)
    })
});

router.put(route + '/:id', 
    guard.check(roles),
    (req, res) => {

    const id = +req.params.id

    const { firstName, lastName, gender, birthday, note } = req.body

    Users.update(id, firstName, lastName, gender, birthday, note)
    .then(user => res.status(201).send({}))
    .catch(err => {
        console.log('Error : Users.update', err)
        res.sendStatus(500)
    })
});

router.delete(route + '/:id',
    guard.check(roles),
    (req, res) => {

    const id = +req.params.id

    Users.remove(id)
    .then(user => res.status(201).send({}))
    .catch(err => {
        console.log('Error : Users.remove', err)
        res.sendStatus(500)
    })
});

exports.initializeRoutes = () => router;
