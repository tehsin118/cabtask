const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const ruleController = require('../controllers/ruleController')

//api endpoint to check the rules for user values.............
router.get('/api/checkRule', ruleController.check_rule)

//api endpoint to get all the rules......
router.get('/api/getRules', ruleController.get_rules)
//api endpoint to get all the rate......
router.get('/api/getAllRates', ruleController.get_all_rates)
//api endpoint to get  rate......
router.get('/api/getRate', ruleController.get_rate)


router.delete('/api/deleteRate', ruleController.delete_rate)

router.post('/api/bookCab', ruleController.book_cab)

router.get('/api/getBookings', ruleController.get_all_bookings)

//payment method route....
router.post('/api/pay', ruleController.pay_amount)


module.exports = router