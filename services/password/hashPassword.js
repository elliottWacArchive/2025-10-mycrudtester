const bcrypt = require("bcrypt");

async function hashPassword (password) {
	return (await bcrypt.hash(password, 10).then((hash) => {
		if (!hash)
			return ({ success: false, message: "Hashing password error" });
		return ({ success: true, hash: password });
	}));
}

module.exports = {
	hashPassword
};