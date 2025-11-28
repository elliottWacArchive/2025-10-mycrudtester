const jwt = require("jsonwebtoken");
require("dotenv").config();

function tokenGenerator(content, expiresIn = "1d") {
    if (
        typeof content !== "object" ||
        !content ||
        expiresIn === undefined ||
        typeof expiresIn !== "string"
    )
        throw new Error("Invalid arguments, impossible to generate token");
    return jwt.sign(content, process.env.JWT_SECRET, { expiresIn: expiresIn });
}

module.exports = {
    tokenGenerator,
};
