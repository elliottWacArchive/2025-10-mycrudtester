const { validateRegisterBody } = require("./registerBody.js");
const { validateLoginBody } = require("./loginBody.js");
const { validateUpdateBody } = require("./updateBody.js");
const { emailAlreadyUsed } = require("./emailAlreadyUsed.js");

module.exports = {
	validateRegisterBody,
	validateLoginBody,
	validateUpdateBody,
	emailAlreadyUsed
};