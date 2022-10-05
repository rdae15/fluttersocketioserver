const jwt = require('jsonwebtoken');

const generateJWT = (uid) => {

	return new Promise((resolve, reject) => {
		const payload = {uid};
	jwt.sign(payload, process.env.JWT_KEY, {
		expiresIn: '48h'
	}, (err, token ) => {
		if (err) {
			// no se pudo crear JWT
				reject('No se pudo crear JWT')
		} else {
			// TOKEN
			resolve(token)
		}
	})

	});
	

}

module.exports = {
	generateJWT
}