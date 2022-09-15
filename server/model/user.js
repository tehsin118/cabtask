const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./../config/config').get(process.env.NODE_ENV);
const SALT_I = 10;

//creating user Schema..........

const userSchema = mongoose.Schema({
    email: {
        type: String,
        require: true,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        require: true,
        minLength: 6
    },
    name: {
        type: String,
        maxLength: 100
    },
    lastname: {
        type: String,
        maxLength: 100
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String
    }
});

//using the mongoose middleware.....

userSchema.pre('save', function (next) {
    bcrypt.genSalt(SALT_I, (err, salt) => {
        if (err) return next(err);

        if (this.isModified('password')) {
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) return next(err);
                this.password = hash;
                next();
            });
        } else {
            next();
        }
    });
});

//creating the own method using the mongoose method functionality.......

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

//creating own method to generate user Token......

userSchema.methods.generateToken = function (cb) {
    let token = jwt.sign(this._id.toHexString(), config.SECRET);

    this.token = token; //assigning the generated token to user......

    this.save((err, user) => {
        if (err) return cb(err);
        cb(null, user);
    });
};

//jwt: json web token...
//creating own  static method like FindById ...........

userSchema.statics.findByToken = function (token, cb) {
    jwt.verify(token, config.SECRET, (err, decode) => {
        this.findOne({ _id: decode, token: token }, (err, user) => {
            if (err) return cb(err);
            cb(null, user);
        });
    });
};

//creating own method to logout the user...

userSchema.methods.deleteToken = function (token, cb) {
    this.update({ $unset: { token: 1 } }, (err, user) => {
        if (err) return cb(err);
        cb(null, user);
    });
};

//now creating the model....

const User = mongoose.model('User', userSchema);

//exporting the model.....

module.exports = { User };
