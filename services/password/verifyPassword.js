const bcrypt = require("bcrypt");

function verifyPassword(password, hash) {
	const isValid = bcrypt.compareSync(password, hash);
	return { success: isValid };
}

module.exports = {
	verifyPassword
};