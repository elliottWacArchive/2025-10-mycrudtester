function formatUpdateBody(req, res, next) {
    const { email, username, password } = req.body;

    res.body = {
        email:
            typeof email === "string"
                ? email.toLowerCase().replace(/[ \t\v]+/g, "")
                : email,
        username:
            typeof username === "string"
                ? username.replace(/[\t\v]+/g, "").trim()
                : username,
        password: password,
    };
    next();
}

module.exports = { formatUpdateBody };
