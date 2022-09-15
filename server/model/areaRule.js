const mongoose = require('mongoose');

//creating the Schema using the mongoose.Schema method.......
//**timestamps */this will record the entry time and date of the data entered with thr record
const ruleSchema = mongoose.Schema(
    {
        orgAdrs: {
            type: String,
            require: true
        },
        orgCords: {
            type: Object,
            require: true
        },
        orgArea: {
            type: String,
            require: true
        },
        orgPlaceObj: {
            type: Object,
            require: true
        },

        distAdrs: {
            type: String,
            require: true
        },
        distCords: {
            type: Object,
            require: true
        },
        distArea: {
            type: String,
            require: true
        },
        distPlaceObj: {
            type: Object,
            require: true
        },
        status: {
            type: String,
            require: true
        },
        rateType: {
            type: String,
            require: true
        }
    },
    { timestamps: true }
);

//creating the model using the mongoose.model method.....

const Rule = mongoose.model('Rule', ruleSchema);

//exporting the model.....

module.exports = { Rule };
