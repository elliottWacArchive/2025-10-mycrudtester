function validateUpdateBody(req, res, next) {
	const { email, username, password } = req.body;

	if (username != null)
		if (typeof username !== "string" || username.length < 1)
			return res.status(400).send({ success: false, message: "Username should have a valid format" });

	if (password != null)
		if (typeof password !== "string" || password.length < 1)
			return res.status(400).send({ success: false, message: "Password should have a valid format" });

	const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/, "gm");
	if (email != null) {
		if (typeof email != "string" || !emailRegex.test(email))
			return res.status(400).send({ success: false, message: "Email should have a valid format" });
		else if (email === req.user.email)
			delete req.body.email;
	}

	next();
}

module.exports = { validateUpdateBody };