const db = require("../../../db/db.js");

async function emailAlreadyUsed(req, res, next) {
    const { email } = req.body;

    const findEmailAlreadyUsed = await db.findOne("Users", {
        email: email,
        active: true,
    });
    if (findEmailAlreadyUsed.success)
        return res
            .status(400)
            .send({ success: false, message: "Email already used" });

    next();
}

module.exports = { emailAlreadyUsed };
