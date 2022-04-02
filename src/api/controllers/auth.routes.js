const express = require('express');
const router = express.Router();
const { passwordsAreEqual } = require('../security/crypto');
const { generateAuthToken } = require('../security/auth');

const { body, validationResult } = require('express-validator');

const Users = require('../models/DAOUsers')

/*
const otherRouter = express.Router()
otherRouter.post('/test', (req, res) => {res.send('ok')})
router.use('/api', otherRouter)
*/

router.post('/subscribe', (req, res) => {
  body('firstName').exists().withMessage('FirstName is empty')
  body('lastName').exists().withMessage('LastName is empty')
  body('gender').exists().withMessage('Gender is empty')
  body('birthday').exists().withMessage('Birthday is empty')
  body('pseudo').exists().withMessage('Pseudo is empty')
  body('email').exists().isEmail().withMessage('Email is empty')
  body('email').isEmail().withMessage('Email is not a email')
  body('password').exists().withMessage('Password is empty')

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { firstName, lastName, gender, birthday, email, pseudo, password } = req.body;
  Users.add(firstName, lastName, gender, birthday, email, pseudo, password).then((userID) => {
    Users.findByID(userID[0]).then((user) => {
      const token = generateAuthToken(user)
      res.status(200).json({ token })
    })
    .catch((err) => {
      console.log('Error : FindById', err)
      res.sendStatus(500)
    })
  })
  .catch((err) => {
    console.log('Error : Add', err)
    res.sendStatus(500)
  })
})

router.post('/login', 
  body('email').exists().withMessage('Email is empty'),
  body('email').isEmail().withMessage('Email is not a email'),
  body('email').notEmpty().withMessage('Email is empty'),
  body('password').exists().withMessage('Password is empty'),
  body('password').notEmpty().withMessage('Password is empty'),
  (req, res) => {
  const errors = validationResult(req)
  console.log(errors)
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body
  Users.findByEmail(email).then((user) => {
    user = user[0]
    if (!user || !passwordsAreEqual(password, user.password))
      return res.sendStatus(401)
  
    const token = generateAuthToken(user)
    res.status(200).json({ token })
  })
});

exports.initializeRoutes = () => router;
