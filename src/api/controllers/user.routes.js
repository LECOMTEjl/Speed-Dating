const express = require('express');
const router = express.Router();
const guard = require('express-jwt-permissions')({
    permissionsProperty: 'role',
});
const { verifyAuthToken } = require('../security/auth')
const Users = require('../models/DAOUsers')
const path = require('path');
const { ReceiverMannager } = require('../utils/receiver-manager')

const route = '/users'

const adminRole = 'ADMIN';
const roles = [[adminRole], ['MEMBER']];


const getSubscriber = (authorization) => {
    let user
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

    let subscriber = getSubscriber(req.headers.authorization)
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
        

    let subscriber = getSubscriber(req.headers.authorization)
    if (!subscriber) return res.sendStatus(401)

    const id = +req.params.id

    Users.findByID(id)
    .then(user => res.status(200).json(user[0]) )
    .catch((err) => {
        console.log('Error : Users.findByID', err)
        res.sendStatus(500)
    })
});

const IMAGE_PATH = path.join(__dirname, '../../app/web-app/assets/user/')
let managerList = []

router.post(route + '/:id' + '/img', 
    guard.check(roles),
    (req, res) => {
        let subscriber = getSubscriber(req.headers.authorization)
        if (!subscriber) return res.sendStatus(401)

        const id = +req.params.id

        let chunk = req.body.data
        let end = req.body?.end ? true : false

        let manager = managerList.find(m => m.id == id)?.manager
        if(!manager) {
            const oldName = req.headers['file-name']
            let fileNameSplit = oldName.split('.')
            const fileExtention = fileNameSplit[fileNameSplit.length - 1] || 'png'
            const newName = id + "." + fileExtention
            manager = new ReceiverMannager(path.join(IMAGE_PATH, newName))
            managerList.push({ id, manager })
        }

        if(chunk) {
            manager.add(chunk)
        }

        if(end) {
            manager.end()
            let index = managerList.findIndex(m => m.id == id)
            managerList.splice(index, 1)
        }

        res.status(200).send({ chunk:'ok' })
    }
)

router.post(route,
    guard.check(roles),
    (req, res) => {

    let subscriber = getSubscriber(req.headers.authorization)
    if (!subscriber) return res.sendStatus(401)

    const { firstName, lastName, gender, birthday } = req.body

    Users.add(subscriber.id, firstName, lastName, gender, birthday)
    .then(id => res.status(201).send({ id }))
    .catch(err => {
        console.log('Error : Users.add', err)
        res.sendStatus(500)
    })
});

router.put(route + '/:id', 
    guard.check(roles),
    (req, res) => {

    let subscriber = getSubscriber(req.headers.authorization)
    if (!subscriber) return res.sendStatus(401)

    const id = +req.params.id

    const { firstName, lastName, gender, birthday } = req.body

    Users.update(id, firstName, lastName, gender, birthday)
    .then(() => res.status(200).send({ status:'ok' }))
    .catch(err => {
        console.log('Error : Users.update', err)
        res.sendStatus(500)
    })
});

router.delete(route + '/:id',
    guard.check(roles),
    (req, res) => {

    let subscriber = getSubscriber(req.headers.authorization)
    if (!subscriber) return res.sendStatus(401)

    const id = +req.params.id

    Users.remove(id)
    .then(user => res.status(201).send({}))
    .catch(err => {
        console.log('Error : Users.remove', err)
        res.sendStatus(500)
    })
});

exports.initializeRoutes = () => router;
