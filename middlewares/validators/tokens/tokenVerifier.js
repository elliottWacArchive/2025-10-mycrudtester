const jwt = require("jsonwebtoken");

function tokenVerifier(req, res, next) {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader && authHeader.split(' ')[1];

		if (!token)
			return res.status(401).send({ success: false, message: "Invalid or missing token" });

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).send({ success: false, message: "Invalid or missing token" });
	}
}

module.exports = { tokenVerifier };
