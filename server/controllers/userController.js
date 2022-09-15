const { User } = require('../model/user');

//** .find({},cb) */ this method is use to get all the data of the model specified
const user_index = (req, res) => {
    User.find({}, (err, user) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(user);
    });
}

const user_register = (req, res) => {
    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.status(400).send(err);
        res.json({
            success: true,
            user: doc
        });
    });
}

const user_login = (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) return res.json({ isAuth: false, message: 'email not found' });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({
                    isAuth: false,
                    message: 'Wrong Password'
                });
            }
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                //sending response to the browser and storing the cookie.......
                res.cookie('auth', user.token).json({
                    isAuth: true,
                    id: user._id,
                    email: user.email
                });
            });
        });
    });
}

const user_logout = (req, res) => {
    // console.log(req);
    // res.send(req.user);
    req.user.deleteToken(req.token, (err, user) => {
        if (err) return res.status(400).send(err);
        res.sendStatus(200);
    });
}



module.exports = {
    user_index,
    user_register,
    user_login,
    user_logout,

}