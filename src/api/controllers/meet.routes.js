const express = require('express');
const router = express.Router();
const { verifyAuthToken } = require('../security/auth');

const Meets = require('../models/DAOMeets')

const route = '/meets'

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
    (req, res) => {

    const userId = +req.query.userId

    Meets.getByUserId(userId)
    .then((user) => res.status(200).json(user) )
    .catch((err) => {
        console.log('Error : Meets.getByUserId', err)
        res.sendStatus(500)
    })
})

router.get(route + '/:id',
    (req, res) => {
    const id = +req.params.id

    const subscriber = getSubscriber(req.headers.authorization)
    if (!subscriber) return res.sendStatus(401)

    Meets.getById(id)
    .then((user) => res.status(200).json(user) )
    .catch((err) => {
        console.log('Error : Meets.getByUserId', err)
        res.sendStatus(500)
    })
})

router.post(route,
    (req, res) => {

    const { userId, date, comment, note } = req.body

    Meets.add(userId, date, comment, note )
    .then((user) => res.status(201).send({}) )
    .catch((err) => {
        console.log('Error : Meets.getByUserId', err)
        res.sendStatus(500)
    })
})

router.put(route + '/:id',
    (req, res) => {
    const id = +req.params.id

    const user = getSubscriber(req.headers.authorization)
    if (!user) return res.sendStatus(401)

    const { userId, date, comment, note } = req.body

    Meets.update(id, userId, date, comment, note)
    .then((user) => res.status(201).send({}) )
    .catch((err) => {
        console.log('Error : Meets.getByUserId', err)
        res.sendStatus(500)
    })
})

router.delete(route + '/:id',
    (req, res) => {
    const id = +req.params.id

    const user = getSubscriber(req.headers.authorization)
    if (!user) return res.sendStatus(401)

    Meets.remove(id)
    .then((user) => res.status(201).send({}) )
    .catch((err) => {
        console.log('Error : Meets.remove', err)
        res.sendStatus(500)
    })
})


exports.initializeRoutes = () => router;
