const mongoose = require('mongoose');

const cabRateSchema = mongoose.Schema(
    {
        rate: {
            type: String,
            require: true
        },
        km: {
            type: Number,
            require: true,
            min: 1
        },
        price: {
            type: Number,
            require: true,
            min: 5
        }
    },
    { timestamps: true }
)
//creating the model using the mongoose.model method.....

const Rate = mongoose.model('Rate', cabRateSchema);

//exporting the model.....

module.exports = { Rate }