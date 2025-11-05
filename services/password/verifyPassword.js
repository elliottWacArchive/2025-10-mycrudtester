const bcrypt = require("bcrypt");

function verifyPassword(password, hash) {
    try {
        const isValid = bcrypt.compareSync(password, hash);
        return { success: isValid };
    } catch (error) {
        return { success: false };
    }
}

module.exports = {
    verifyPassword,
};
