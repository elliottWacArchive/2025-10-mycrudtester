function formatLoginBody(req, res, next) {
	const { email, password } = req.body;

	req.body = {
		email: typeof email === "string" ? email.toLowerCase().trim() : email,
		password: password
	};
	next();
}

module.exports = { formatLoginBody };