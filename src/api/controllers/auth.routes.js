const express = require('express');
const router = express.Router();
const { passwordsAreEqual } = require('../security/crypto');
const { generateAuthToken, verifyAuthToken } = require('../security/auth');

const { body, validationResult } = require('express-validator');

const Subscriber = require('../models/DAOSubscriber')

const guard = require('express-jwt-permissions')({
    permissionsProperty: 'role',
});
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

router.get('/subscriber',
    guard.check(roles),
    (req, res) => {

    let subscriber = getSubscriber(req.headers.authorization)
    if (!subscriber) return res.sendStatus(401)
    
    Subscriber.getById(subscriber.id)
    .then(subscriber => res.status(200).send(subscriber[0]))
    .catch(err => console.log('Error : Subscriber.getById', err))
})

router.post('/subscribe',
    body('email').exists().isEmail().withMessage('Email is empty'),
    body('email').notEmpty().isEmail().withMessage('Email is empty'),
    body('email').isEmail().withMessage('Email is not a email'),

    body('pseudo').exists().withMessage('Pseudo is empty'),
    body('pseudo').notEmpty().withMessage('Pseudo is empty'),

    body('password').exists().withMessage('Password is empty'),
    body('password').notEmpty().withMessage('Password is empty'),
    (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { email, pseudo, password } = req.body;

        Subscriber.findByEmail(email).then(subscriber => {
            if(subscriber?.[0])
                return res.sendStatus(409)
            
            Subscriber.add(email, pseudo, password).then(subscriberId => {
                Subscriber.findByID(subscriberId[0]).then(subscriber => {
                    subscriber = subscriber[0]
                    const token = generateAuthToken(subscriber.id, subscriber.role, subscriber.password)
                    res.status(201).json({ token })
                })
                .catch(err => {
                    console.log('Error : Subscriber.findByID', err)
                    res.sendStatus(500)
                })
            })
            .catch(err => {
                console.log('Error : Subscriber.add', err)
                res.sendStatus(500)
            })
        })
        .catch(err => {
            console.log('Error : Subscriber.findByEmail', err)
            res.sendStatus(500)
        })
})

router.post('/login',
    body('email').exists().withMessage('Email is empty'),
    body('email').notEmpty().withMessage('Email is empty'),
    body('email').isEmail().withMessage('Email is not a email'),

    body('password').exists().withMessage('Password is empty'),
    body('password').notEmpty().withMessage('Password is empty'),
    (req, res) => {

        const errors = validationResult(req)
        console.log(errors)
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body
        Subscriber.findByEmail(email).then(subscriber => {
            subscriber = subscriber[0]
            if (!subscriber || !passwordsAreEqual(password, subscriber.password))
                return res.sendStatus(400)

            const token = generateAuthToken(subscriber.id, subscriber.role, subscriber.password)
            res.status(201).json({ token })
        })
        .catch(err => {
            console.log('Error : Subscriber.findByEmail', err)
            res.sendStatus(500)
        })
});

exports.initializeRoutes = () => router;
