const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const { login } = require('../controllers/authControllers')

router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
)

module.exports = router
