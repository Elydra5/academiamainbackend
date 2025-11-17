const express = require('express')
const billingController = require('../controllers/billingController')

const router = express.Router()

router.post('/generate', billingController.generateInvoice)

module.exports = router
