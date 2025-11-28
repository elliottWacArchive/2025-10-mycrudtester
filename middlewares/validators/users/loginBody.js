function validateLoginBody(req, res, next) {
    const { email, password } = req.body;

    if (password == null || email == null)
        return res
            .status(400)
            .send({ success: false, message: "Missing field(s)" });

    if (typeof password !== "string" || password.length < 1)
        return res
            .status(400)
            .send({
                success: false,
                message: "Password should have a valid format",
            });

    const emailRegex = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/,
        "gm"
    );
    if (typeof email != "string" || !emailRegex.test(email))
        return res
            .status(400)
            .send({
                success: false,
                message: "Email should have a valid format",
            });

    next();
}

module.exports = { validateLoginBody };
