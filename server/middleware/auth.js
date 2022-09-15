const { User } = require('./../model/user');

let auth = (req, res, next) => {
	let token = req.cookies.auth;

	User.findByToken(token, (err, user) => {
		if (err) throw err;
		//checking if the user is sign-in or not......
		if (!user) {
			return res.json({
				error: true
			});
		}
		//user is sign-in then......
		req.token = token;
		req.user = user;
		next();
	});
};

module.exports = { auth };
