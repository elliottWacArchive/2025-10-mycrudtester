const bcrypt = require("bcrypt");

async function hashPassword(password) {
    try {
        return await bcrypt.hash(password, 10).then((hash) => {
            if (!hash)
                return { success: false, message: "Hashing password error" };
            return { success: true, hash: hash };
        });
    } catch (error) {
        return { success: false, message: "Hashing password error" };
    }
}

module.exports = {
    hashPassword,
};
