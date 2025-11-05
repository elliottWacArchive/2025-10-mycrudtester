const jwt = require("jsonwebtoken");

function tokenVerifier(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer "))
            return res
                .status(401)
                .send({ success: false, message: "Invalid or missing token" });
        const token = authHeader && authHeader.split(" ")[1];

        if (!token)
            return res
                .status(401)
                .send({ success: false, message: "Invalid or missing token" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (err) {
        return res
            .status(401)
            .send({ success: false, message: "Invalid or missing token" });
    }
}

module.exports = { tokenVerifier };
