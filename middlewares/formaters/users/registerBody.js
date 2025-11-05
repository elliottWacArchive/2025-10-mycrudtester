function formatRegisterBody(req, res, next) {
	const { email, username, password } = req.body;

	req.body = {
		email: typeof email === "string" ? email.toLowerCase().trim() : email,
		username: typeof username === "string" ? username.trim() : username,
		password: password
	};
	next();
}

module.exports = { formatRegisterBody };