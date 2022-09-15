const { Rule } = require('../model/areaRule');
const { Rate } = require('../model/cabRate');
const { Booking } = require('../model/orderedCab');
const nodemailer = require('nodemailer');
const stripe = require("stripe")("sk_test_51I8aE2KpLrZmu3308JWIYpCQwnJSFgsSBsJYkeL4TI3ys9N1pq4p7buSNUPKH61od4JPbW1tPGG00omr6IlGZhoj00oCQyysoj");


//
//initailizing the nodemailer.....
//
const transporter = nodemailer.createTransport({
    // host: 'smtp.gmail.com',
    // port: 465,
    // secure: true,
    service: 'gmail',
    auth: {
        user: "saaqii4799@gmail.com", // 
        pass: process.env.GMAIL_PASSWORD, // generated ethereal password
    },
});


const check_rule = (req, res) => {

    const orign = JSON.parse(req.query.spoint);
    const dist = JSON.parse(req.query.epoint);
    // console.log(orign)
    // Rule.find({ orgAdrs: orign.sAdrs, distAdrs: dist.eAdrs }).exec((err, doc) => {
    //     if (err) return res.status(400).json(err);
    //     if (doc[0].status === "Available") {
    //         let count = 0;
    //         let rule = doc[0];
    //         // console.log(rule);
    //         // to check To & From area for any location.......
    //         if (rule.orgArea === "any" && rule.distArea === "any") {
    //             console.log("working1");
    //             res.status(200).json({
    //                 cab: true,
    //                 message: "Cab on this route is available",

    //             })
    //         }
    //         // to check user start point location for specfic radius set in the rule....
    //         if (rule.orgArea !== "any") {
    //             const result = arePointsNear(orign, rule.orgCords, parseInt(rule.orgArea));
    //             console.log(result)
    //             if (result) {
    //                 count++
    //             }
    //         } else { count++ }

    //         // to check user end point location for specfic radius set in the rule....
    //         if (rule.distArea !== "any") {
    //             const result = arePointsNear(dist, rule.distCords, parseInt(rule.distArea));
    //             console.log(result)
    //             if (result) {
    //                 count++
    //             }
    //         } else { count++ }
    //         count === 2 ?
    //             res.json({
    //                 ...doc,
    //                 message: "Cab on this route is available",
    //                 cab: true

    //             }) :
    //             res.json({
    //                 cab: false,
    //                 message: "Cab on this route is not available",

    //             })
    //     }
    // });
    Rule.find({}).exec((err, doc) => {
        if (err) return res.status(400).json(err);
        let arr = doc.find((rule) => {

            console.log(rule)
            let count = 0;
            if (rule.status === "Available") {

                if (rule.orgArea !== "any") {
                    const result = arePointsNear(orign, rule.orgCords, parseInt(rule.orgArea));
                    console.log(result + "org Km")
                    if (result) {
                        count++;
                    }
                } else {
                    if (orign.lat === rule.orgCords.lat && orign.lng === rule.orgCords.lng) {
                        console.log("org cord true")

                        count++;
                    } else {
                        const res = checkSameArea(orign.sAdrs, rule.orgAdrs, 'from');
                        if (res) {
                            console.log("org area true")

                            count++
                        }
                    }
                }

                // to check user end point location for specfic radius set in the rule....
                if (rule.distArea !== "any") {
                    const result = arePointsNear(dist, rule.distCords, parseInt(rule.distArea));
                    console.log(result + "dist km")
                    if (result) {
                        count++;
                    }
                } else {
                    if (dist.lat === rule.distCords.lat && dist.lng === rule.distCords.lng) {
                        count++;
                        console.log("dist cord")
                    } else {
                        const res = checkSameArea(dist.eAdrs, rule.distAdrs, 'to');
                        if (res) {
                            console.log("dist area true")

                            count++
                        }
                    }

                }

            }
            if (count === 2) {
                return true
            }
        })
        if (arr != undefined) {

            res.status(200).json({
                arr,
                cab: true,
                message: "cab available"
            })
        } else {
            res.status(200).json({

                cab: false,
                message: "cab not available"
            })
        }
    });
}
//function to check the user point location within the rulesArea radius..... 
function arePointsNear(checkPoint, centerPoint, km) {

    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;

    return Math.sqrt(dx * dx + dy * dy) <= km;
}
//function to check for any location in the rule area.....
const checkSameArea = (userAdrs, ruleAdrs, name) => {
    let arr = userAdrs.split(',');
    let count = [];
    for (let i = 0; i < arr.length - 1; i++) {
        let a = ruleAdrs.includes(arr[i]);
        if (a) {
            count.push(arr[i]);
        }
    }

    if (count.length >= 3 && name === 'from') {

        return true;
    }
    if (count.length >= 2 && name === 'to') {
        return true;
    }
}

//
//to get all rules from database....
//
const get_rules = (req, res) => {

    Rule.find({}, (err, doc) => {
        if (err) return res.status(400).json(err);
        res.send(doc);
    });
}
//*****************Cab  Rate**************/
//
//api end point to get all rates
//
const get_all_rates = (req, res) => {
    Rate.find({}, (err, doc) => {
        if (err) return res.status(400).json(err);
        res.send(doc);
    });
}

const get_rate = (req, res) => {
    const type = req.query.type;
    Rate.find({ rate: type }, (err, doc) => {
        if (err) return res.status(400).json(err);
        res.send(doc)
    })
}

const delete_rate = (req, res) => {
    const id = req.query.id;
    Rate.findByIdAndRemove(id, (err, doc) => {
        if (err) return res.status(400).json(err);
        res.status(200).json({
            message: "deleted"
        })
    })
}

const book_cab = (req, res) => {
    const booking = new Booking(req.body);
    booking.save().then(doc => {
        console.log(doc)
        const mailOption = {
            from: 'saaqii4799@gmail.com',
            to: doc.userEmail,
            subject: 'Sending email using nodemailer',
            text: 'Test mailing using the nodemailer',
            html: `<p>Hi ${doc.userName}, thanks for booking</p>
                <p>Pick up: ${doc.route.orgAdrs}</p>        
                <p>Drop of: ${doc.route.distAdrs}</p>
                <p>Date: ${doc.date}</p>
                <p>Time: ${doc.time}</p>
                <p>Car: ${doc.cabName}</p>
                <p>Pay Method: ${doc.payMethod}</p>


            `
        };
        transporter.sendMail(mailOption).then(info => {
            res.status(200).json({
                post: true,
                message: 'For Details Check your Email'
            });

            console.log("Email sent" + info.messageId);
        })
            .catch(err => {
                res.status(200).json({
                    post: true,
                    message: 'Email Sending Failed.!!'
                });
            })



    }).catch(err => {

        if (err) return res.status(400).json({
            post: false,
            message: 'Booking Failed.!!'
        });
        //error handling needed.......
    })
    // (err, doc) => {
    // }
}

const get_all_bookings = (req, res) => {
    Booking.find({}, (err, doc) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(doc)
    })
}

const pay_amount = async (req, res) => {
    const customer = await stripe.customers.create({
        email: req.body.email
    })
    const paymentIntent = await stripe.paymentIntents.create({
        customer: customer.id,
        amount: req.body.amount.toString(),
        currency: "EUR",
        description: "Cab Service"
    });
    res.send(paymentIntent.client_secret)
    console.log(paymentIntent.client_secret)
}

//exporting all function of the controller......
module.exports = {
    check_rule,
    get_rules,
    get_all_rates,
    get_rate,
    delete_rate,
    book_cab,
    get_all_bookings,
    pay_amount
}