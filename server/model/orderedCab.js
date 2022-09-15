const mongoose = require('mongoose');

const cabOrderSchema = mongoose.Schema({
    userId: {
        type: String,
    },
    userName: {
        type: String,
    },
    cabId: {
        type: String,
    },
    cabName: {
        type: String,
    },
    route: {
        type: Object,
    },
    rate: {
        type: String,
    },
    date: {
        type: Date,
    },
    time: {
        type: String,
    },
    payMethod: {
        type: String,
    },
    userEmail: {
        type: String,
    },
    phoneNo: {
        type: String,
    }
})

const Booking = mongoose.model('Booking', cabOrderSchema)

module.exports = { Booking }