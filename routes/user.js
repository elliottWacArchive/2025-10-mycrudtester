const express = require("express");
const router = express.Router();
const {
    validateRegisterBody,
    emailAlreadyUsed,
    validateLoginBody,
    validateUpdateBody,
} = require("../middlewares/validators/users/index.js");
const {
    formatRegisterBody,
    formatLoginBody,
    formatUpdateBody,
} = require("../middlewares/formaters/users/index.js");
const {
    hashPassword,
    verifyPassword,
} = require("../services/password/index.js");
const { tokenGenerator } = require("../services/tokens/index.js");
const { tokenVerifier } = require("../middlewares/validators/tokens/index.js");
const db = require("../db/db.js");
const { ObjectId } = require("mongodb");

router.post(
    "/",
    formatRegisterBody,
    validateRegisterBody,
    emailAlreadyUsed,
    async function (req, res) {
        try {
            const { username, email, password } = req.body;

            const hashedPassword = await hashPassword(password);
            if (!hashedPassword.success)
                return {
                    success: false,
                    data: "Error during user registration",
                };

            const userCreds = {
                active: true,
                email: email,
                username: username,
                password: hashedPassword.hash,
            };
            const resAddUser = await db.addInstance("Users", userCreds);
            if (!resAddUser.success)
                return es.status(500).send({
                    success: false,
                    message: "Error during user registration",
                });
            return res
                .status(200)
                .send({ success: true, data: { _id: resAddUser.insertedId } });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                success: false,
                message: "Error during user registration",
            });
        }
    }
);

router.put("/", formatLoginBody, validateLoginBody, async function (req, res) {
    try {
        const { email, password } = req.body;

        const emailAlreadyExists = await db.findOne("Users", {
            email: email,
            active: true,
        });
        if (!emailAlreadyExists.success)
            return res.status(400).send({
                success: false,
                message: "User not found or credentials are bad",
            });

        const userFound = emailAlreadyExists.result;
        const comparePass = verifyPassword(password, userFound.password);
        if (!comparePass.success)
            return res.status(400).send({
                success: false,
                message: "User not found or credentials are bad",
            });

        const token = tokenGenerator(
            { email: userFound.email, _id: userFound._id },
            "1d"
        );

        return res.status(200).send({ success: true, data: { token: token } });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error during user login",
        });
    }
});

router.patch(
    "/",
    tokenVerifier,
    formatUpdateBody,
    validateUpdateBody,
    async function (req, res) {
        try {
            const { _id } = req.user;
            const { email, username, password } = req.body;
            const fieldsToUpdate = {};

            const getUser = await db.findOne("Users", {
                _id: new ObjectId(_id),
            });
            if (getUser.success && getUser.result.active === false)
                return res.status(400).send({
                    success: false,
                    message: "You cannot perform action on this user",
                });
            else if (!getUser.success)
                return res
                    .status(400)
                    .send({ success: false, message: "User not found" });

            if (email) {
                const emailCheck = await db.findOne("Users", {
                    email: email,
                    active: true,
                });
                if (
                    emailCheck.success &&
                    emailCheck.result._id.toString() !== _id
                ) {
                    return res.status(400).send({
                        success: false,
                        message: "Email already used",
                    });
                }
                fieldsToUpdate.email = email;
            }

            if (username) fieldsToUpdate.username = username;
            if (password) {
                const hashedPassword = await hashPassword(password);
                if (!hashedPassword.success)
                    return { success: false, data: "Error during data saving" };
                fieldsToUpdate.password = hashedPassword.hash;
            }

            const updateUserReq = await db.updateManyFields(
                { _id: new ObjectId(_id) },
                "Users",
                fieldsToUpdate
            );
            if (!updateUserReq.success)
                return res.status(500).send({
                    success: false,
                    message: "Error during user update",
                });

            res.status(200).send({ success: true, message: "User updated" });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                success: false,
                message: "Error during user update",
            });
        }
    }
);

router.delete("/", tokenVerifier, async function (req, res) {
    try {
        const { _id } = req.user;

        const getUser = await db.findOne("Users", {
            _id: new ObjectId(_id),
            active: true,
        });
        if (getUser.success && getUser.result.active === false)
            return res.status(400).send({
                success: false,
                message: "You cannot perform action on this user",
            });
        else if (!getUser.success)
            return res
                .status(400)
                .send({ success: false, message: "User not found" });

        const deleteUserReq = await db.updateField(
            { _id: new ObjectId(_id) },
            "Users",
            "active",
            false
        );
        if (!deleteUserReq.success)
            return res.status(500).send({
                success: false,
                message: "Error during user deletion",
            });

        res.status(200).send({ success: true, message: "User deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error during user deletion",
        });
    }
});

router.get("/", tokenVerifier, async function (req, res) {
    try {
        const { _id } = req.user;

        const findUser = await db.findOne("Users", {
            _id: new ObjectId(_id),
            active: true,
        });
        if (!findUser.success)
            return res.status(400).send({
                success: false,
                message: "User not found or no longer exists",
            });

        const userFound = findUser.result;
        delete userFound.password;
        delete userFound.active;

        return res.status(200).send({ success: true, data: userFound });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error during user login",
        });
    }
});

router.get("/:id", tokenVerifier, async function (req, res) {
    try {
        const id = req.params.id;

        const findUser = await db.findOne("Users", {
            _id: new ObjectId(id),
            active: true,
        });
        if (!findUser.success)
            return res.status(400).send({
                success: false,
                message: "User not found or no longer exists",
            });

        const userFound = findUser.result;
        delete userFound.password;
        delete userFound.active;

        return res.status(200).send({ success: true, data: userFound });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error during user login",
        });
    }
});

module.exports = router;
