const {
    validateLoginBody,
} = require("../middlewares/validators/users/loginBody");
const {
    validateRegisterBody,
} = require("../middlewares/validators/users/registerBody");
const {
    validateUpdateBody,
} = require("../middlewares/validators/users/updateBody");
const {
    emailAlreadyUsed,
} = require("../middlewares/validators/users/emailAlreadyUsed");
const db = require("../db/db.js");

const makeRes = () => {
    const res = {};
    res.status = jasmine.createSpy("status").and.callFake(() => res);
    res.send = jasmine.createSpy("send");
    return res;
};

describe("LoginBody Validator", () => {
    let req, res, next;

    beforeEach(() => {
        res = makeRes();
        next = jasmine.createSpy("next");
    });

    it("appelle next() si email et password valides", () => {
        req = {
            body: {
                email: "test@example.com",
                password: "password123",
            },
        };
        validateLoginBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it("400 si email manque", () => {
        req = {
            body: {
                password: "password123",
            },
        };
        validateLoginBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Missing field(s)",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email est null", () => {
        req = {
            body: {
                email: null,
                password: "password123",
            },
        };
        validateLoginBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Missing field(s)",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si password manque", () => {
        req = {
            body: {
                email: "test@example.com",
            },
        };
        validateLoginBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Missing field(s)",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si password est null", () => {
        req = {
            body: {
                email: "test@example.com",
                password: null,
            },
        };
        validateLoginBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Missing field(s)",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email et password manquent tous les deux", () => {
        req = {
            body: {},
        };
        validateLoginBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Missing field(s)",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si password est une string vide", () => {
        req = {
            body: {
                email: "test@example.com",
                password: "",
            },
        };
        validateLoginBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Password should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si password n'est pas une string", () => {
        req = {
            body: {
                email: "test@example.com",
                password: 12345,
            },
        };
        validateLoginBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Password should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si password est un objet", () => {
        req = {
            body: {
                email: "test@example.com",
                password: { pass: "test" },
            },
        };
        validateLoginBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Password should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si password est un array", () => {
        req = {
            body: {
                email: "test@example.com",
                password: ["pass"],
            },
        };
        validateLoginBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Password should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email n'est pas une string", () => {
        req = {
            body: {
                email: 12345,
                password: "password123",
            },
        };
        validateLoginBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email est une string vide", () => {
        req = {
            body: {
                email: "",
                password: "password123",
            },
        };
        validateLoginBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email n'a pas de @", () => {
        req = {
            body: {
                email: "testexample.com",
                password: "password123",
            },
        };
        validateLoginBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email n'a pas de domaine", () => {
        req = {
            body: {
                email: "test@",
                password: "password123",
            },
        };
        validateLoginBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email n'a pas d'utilisateur", () => {
        req = {
            body: {
                email: "@example.com",
                password: "password123",
            },
        };
        validateLoginBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email avec espaces", () => {
        req = {
            body: {
                email: "test @example.com",
                password: "password123",
            },
        };
        validateLoginBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email est un objet", () => {
        req = {
            body: {
                email: { email: "test@example.com" },
                password: "password123",
            },
        };
        validateLoginBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("appelle next() avec email complexe valide", () => {
        req = {
            body: {
                email: "user.name+tag@example.co.uk",
                password: "password123",
            },
        };
        validateLoginBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() avec email avec chiffres", () => {
        req = {
            body: {
                email: "user123@example123.com",
                password: "password123",
            },
        };
        validateLoginBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() avec email avec tirets", () => {
        req = {
            body: {
                email: "user-name@ex-ample.com",
                password: "password123",
            },
        };
        validateLoginBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() avec password contenant caractères spéciaux", () => {
        req = {
            body: {
                email: "test@example.com",
                password: "P@ssw0rd!#$%",
            },
        };
        validateLoginBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() avec password très long", () => {
        req = {
            body: {
                email: "test@example.com",
                password: "a".repeat(1000),
            },
        };
        validateLoginBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("400 si password est undefined", () => {
        req = {
            body: {
                email: "test@example.com",
                password: undefined,
            },
        };
        validateLoginBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Missing field(s)",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email est undefined", () => {
        req = {
            body: {
                email: undefined,
                password: "password123",
            },
        };
        validateLoginBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Missing field(s)",
        });
        expect(next).not.toHaveBeenCalled();
    });
});

describe("RegisterBody Validator", () => {
    let req, res, next;

    beforeEach(() => {
        res = makeRes();
        next = jasmine.createSpy("next");
    });

    it("appelle next() si email, username et password valides", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it("400 si email manque", () => {
        req = {
            body: {
                username: "testuser",
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Missing field(s)",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email est null", () => {
        req = {
            body: {
                email: null,
                username: "testuser",
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Missing field(s)",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email est undefined", () => {
        req = {
            body: {
                email: undefined,
                username: "testuser",
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Missing field(s)",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si username manque", () => {
        req = {
            body: {
                email: "test@example.com",
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Missing field(s)",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si username est null", () => {
        req = {
            body: {
                email: "test@example.com",
                username: null,
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Missing field(s)",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si username est undefined", () => {
        req = {
            body: {
                email: "test@example.com",
                username: undefined,
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Missing field(s)",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si password manque", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Missing field(s)",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si password est null", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
                password: null,
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Missing field(s)",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si password est undefined", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
                password: undefined,
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Missing field(s)",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si tous les champs manquent", () => {
        req = {
            body: {},
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Missing field(s)",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si username est une string vide", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "",
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Username should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si username n'est pas une string", () => {
        req = {
            body: {
                email: "test@example.com",
                username: 12345,
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Username should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si username est un objet", () => {
        req = {
            body: {
                email: "test@example.com",
                username: { name: "test" },
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Username should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si username est un array", () => {
        req = {
            body: {
                email: "test@example.com",
                username: ["user"],
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Username should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si password est une string vide", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
                password: "",
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Password should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si password n'est pas une string", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
                password: 12345,
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Password should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si password est un objet", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
                password: { pass: "test" },
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Password should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si password est un array", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
                password: ["pass"],
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Password should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email n'est pas une string", () => {
        req = {
            body: {
                email: 12345,
                username: "testuser",
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email est une string vide", () => {
        req = {
            body: {
                email: "",
                username: "testuser",
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email n'a pas de @", () => {
        req = {
            body: {
                email: "testexample.com",
                username: "testuser",
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email n'a pas de domaine", () => {
        req = {
            body: {
                email: "test@",
                username: "testuser",
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email n'a pas d'utilisateur", () => {
        req = {
            body: {
                email: "@example.com",
                username: "testuser",
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email avec espaces", () => {
        req = {
            body: {
                email: "test @example.com",
                username: "testuser",
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email est un objet", () => {
        req = {
            body: {
                email: { email: "test@example.com" },
                username: "testuser",
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("appelle next() avec email complexe valide", () => {
        req = {
            body: {
                email: "user.name+tag@example.co.uk",
                username: "testuser",
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() avec username contenant chiffres", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "user123",
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() avec username contenant caractères spéciaux", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "user_name-123",
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() avec password contenant caractères spéciaux", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
                password: "P@ssw0rd!#$%",
            },
        };
        validateRegisterBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() avec username très long", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "a".repeat(1000),
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() avec password très long", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
                password: "a".repeat(1000),
            },
        };
        validateRegisterBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() avec username d'un caractère", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "a",
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() avec password d'un caractère", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
                password: "a",
            },
        };
        validateRegisterBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("400 si username est boolean", () => {
        req = {
            body: {
                email: "test@example.com",
                username: true,
                password: "password123",
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Username should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si password est boolean", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
                password: false,
            },
        };
        validateRegisterBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Password should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });
});

describe("UpdateBody Validator", () => {
    let req, res, next;

    beforeEach(() => {
        res = makeRes();
        next = jasmine.createSpy("next");
    });

    it("appelle next() si tous les champs sont valides", () => {
        req = {
            body: {
                email: "new@example.com",
                username: "newuser",
                password: "newpass123",
            },
            user: {
                email: "old@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it("appelle next() si body est vide", () => {
        req = {
            body: {},
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() si seulement email fourni", () => {
        req = {
            body: {
                email: "new@example.com",
            },
            user: {
                email: "old@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() si seulement username fourni", () => {
        req = {
            body: {
                username: "newuser",
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() si seulement password fourni", () => {
        req = {
            body: {
                password: "newpass123",
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("supprime email du body si identique à req.user.email", () => {
        req = {
            body: {
                email: "same@example.com",
                username: "newuser",
            },
            user: {
                email: "same@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(req.body.email).toBeUndefined();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("garde email du body si différent de req.user.email", () => {
        req = {
            body: {
                email: "new@example.com",
                username: "newuser",
            },
            user: {
                email: "old@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(req.body.email).toBe("new@example.com");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("400 si username est string vide", () => {
        req = {
            body: {
                username: "",
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Username should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si username n'est pas une string", () => {
        req = {
            body: {
                username: 12345,
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Username should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si username est un objet", () => {
        req = {
            body: {
                username: { name: "test" },
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Username should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si username est un array", () => {
        req = {
            body: {
                username: ["user"],
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Username should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si username est boolean", () => {
        req = {
            body: {
                username: true,
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Username should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("appelle next() si username est null", () => {
        req = {
            body: {
                username: null,
                email: "test@example.com",
            },
            user: {
                email: "old@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() si username est undefined", () => {
        req = {
            body: {
                username: undefined,
                email: "test@example.com",
            },
            user: {
                email: "old@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("400 si password est string vide", () => {
        req = {
            body: {
                password: "",
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Password should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si password n'est pas une string", () => {
        req = {
            body: {
                password: 12345,
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Password should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si password est un objet", () => {
        req = {
            body: {
                password: { pass: "test" },
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Password should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si password est un array", () => {
        req = {
            body: {
                password: ["pass"],
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Password should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si password est boolean", () => {
        req = {
            body: {
                password: false,
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Password should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("appelle next() si password est null", () => {
        req = {
            body: {
                password: null,
                email: "test@example.com",
            },
            user: {
                email: "old@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() si password est undefined", () => {
        req = {
            body: {
                password: undefined,
                email: "test@example.com",
            },
            user: {
                email: "old@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("400 si email est string vide", () => {
        req = {
            body: {
                email: "",
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email n'est pas une string", () => {
        req = {
            body: {
                email: 12345,
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email est un objet", () => {
        req = {
            body: {
                email: { email: "test@example.com" },
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email est un array", () => {
        req = {
            body: {
                email: ["test@example.com"],
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email est boolean", () => {
        req = {
            body: {
                email: true,
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("appelle next() si email est null", () => {
        req = {
            body: {
                email: null,
                username: "newuser",
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() si email est undefined", () => {
        req = {
            body: {
                email: undefined,
                username: "newuser",
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("400 si email n'a pas de @", () => {
        req = {
            body: {
                email: "testexample.com",
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email n'a pas de domaine", () => {
        req = {
            body: {
                email: "test@",
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email n'a pas d'utilisateur", () => {
        req = {
            body: {
                email: "@example.com",
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email avec espaces", () => {
        req = {
            body: {
                email: "test @example.com",
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("appelle next() avec email complexe valide", () => {
        req = {
            body: {
                email: "user.name+tag@example.co.uk",
            },
            user: {
                email: "old@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() avec username d'un caractère", () => {
        req = {
            body: {
                username: "a",
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() avec password d'un caractère", () => {
        req = {
            body: {
                password: "a",
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() avec username très long", () => {
        req = {
            body: {
                username: "a".repeat(1000),
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() avec password très long", () => {
        req = {
            body: {
                password: "a".repeat(1000),
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() avec username contenant caractères spéciaux", () => {
        req = {
            body: {
                username: "user_name-123",
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() avec password contenant caractères spéciaux", () => {
        req = {
            body: {
                password: "P@ssw0rd!#$%",
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() avec email, username et password tous null", () => {
        req = {
            body: {
                email: null,
                username: null,
                password: null,
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("400 si email valide mais username invalide", () => {
        req = {
            body: {
                email: "new@example.com",
                username: "",
            },
            user: {
                email: "old@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Username should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si email valide mais password invalide", () => {
        req = {
            body: {
                email: "new@example.com",
                password: "",
            },
            user: {
                email: "old@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Password should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("400 si username valide mais email invalide", () => {
        req = {
            body: {
                email: "invalidemail",
                username: "validuser",
            },
            user: {
                email: "user@example.com",
            },
        };
        validateUpdateBody(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email should have a valid format",
        });
        expect(next).not.toHaveBeenCalled();
    });
});

describe("emailAlreadyUsed Validator", () => {
    let req, res, next;

    beforeEach(() => {
        res = makeRes();
        next = jasmine.createSpy("next");
    });

    it("appelle next() si email n'existe pas", async () => {
        req = {
            body: {
                email: "new@example.com",
            },
        };
        spyOn(db, "findOne").and.resolveTo({ success: false });
        await emailAlreadyUsed(req, res, next);
        expect(db.findOne).toHaveBeenCalledWith("Users", {
            email: "new@example.com",
            active: true,
        });
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it("400 si email existe déjà", async () => {
        req = {
            body: {
                email: "existing@example.com",
            },
        };
        spyOn(db, "findOne").and.resolveTo({
            success: true,
            result: {
                _id: "123",
                email: "existing@example.com",
                active: true,
            },
        });
        await emailAlreadyUsed(req, res, next);
        expect(db.findOne).toHaveBeenCalledWith("Users", {
            email: "existing@example.com",
            active: true,
        });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email already used",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("appelle next() si email existe mais utilisateur inactif", async () => {
        req = {
            body: {
                email: "inactive@example.com",
            },
        };
        spyOn(db, "findOne").and.resolveTo({ success: false });
        await emailAlreadyUsed(req, res, next);
        expect(db.findOne).toHaveBeenCalledWith("Users", {
            email: "inactive@example.com",
            active: true,
        });
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() si email est null", async () => {
        req = {
            body: {
                email: null,
            },
        };
        spyOn(db, "findOne").and.resolveTo({ success: false });
        await emailAlreadyUsed(req, res, next);
        expect(db.findOne).toHaveBeenCalledWith("Users", {
            email: null,
            active: true,
        });
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() si email est undefined", async () => {
        req = {
            body: {
                email: undefined,
            },
        };
        spyOn(db, "findOne").and.resolveTo({ success: false });
        await emailAlreadyUsed(req, res, next);
        expect(db.findOne).toHaveBeenCalledWith("Users", {
            email: undefined,
            active: true,
        });
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() si email est string vide", async () => {
        req = {
            body: {
                email: "",
            },
        };
        spyOn(db, "findOne").and.resolveTo({ success: false });
        await emailAlreadyUsed(req, res, next);
        expect(db.findOne).toHaveBeenCalledWith("Users", {
            email: "",
            active: true,
        });
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("400 si email existe avec casse différente", async () => {
        req = {
            body: {
                email: "EXISTING@EXAMPLE.COM",
            },
        };
        spyOn(db, "findOne").and.resolveTo({
            success: true,
            result: {
                _id: "123",
                email: "EXISTING@EXAMPLE.COM",
                active: true,
            },
        });
        await emailAlreadyUsed(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email already used",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("appelle next() si body est vide", async () => {
        req = {
            body: {},
        };
        spyOn(db, "findOne").and.resolveTo({ success: false });
        await emailAlreadyUsed(req, res, next);
        expect(db.findOne).toHaveBeenCalledWith("Users", {
            email: undefined,
            active: true,
        });
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() si email est nombre", async () => {
        req = {
            body: {
                email: 12345,
            },
        };
        spyOn(db, "findOne").and.resolveTo({ success: false });
        await emailAlreadyUsed(req, res, next);
        expect(db.findOne).toHaveBeenCalledWith("Users", {
            email: 12345,
            active: true,
        });
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() si email est objet", async () => {
        req = {
            body: {
                email: { test: "value" },
            },
        };
        spyOn(db, "findOne").and.resolveTo({ success: false });
        await emailAlreadyUsed(req, res, next);
        expect(db.findOne).toHaveBeenCalledWith("Users", {
            email: { test: "value" },
            active: true,
        });
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() si email est array", async () => {
        req = {
            body: {
                email: ["test@example.com"],
            },
        };
        spyOn(db, "findOne").and.resolveTo({ success: false });
        await emailAlreadyUsed(req, res, next);
        expect(db.findOne).toHaveBeenCalledWith("Users", {
            email: ["test@example.com"],
            active: true,
        });
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("appelle next() si email est boolean", async () => {
        req = {
            body: {
                email: true,
            },
        };
        spyOn(db, "findOne").and.resolveTo({ success: false });
        await emailAlreadyUsed(req, res, next);
        expect(db.findOne).toHaveBeenCalledWith("Users", {
            email: true,
            active: true,
        });
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("400 si db.findOne retourne plusieurs résultats mais success true", async () => {
        req = {
            body: {
                email: "test@example.com",
            },
        };
        spyOn(db, "findOne").and.resolveTo({
            success: true,
            result: {
                _id: "123",
                email: "test@example.com",
                username: "testuser",
                active: true,
            },
        });
        await emailAlreadyUsed(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email already used",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("appelle next() avec email complexe valide non existant", async () => {
        req = {
            body: {
                email: "user.name+tag@example.co.uk",
            },
        };
        spyOn(db, "findOne").and.resolveTo({ success: false });
        await emailAlreadyUsed(req, res, next);
        expect(db.findOne).toHaveBeenCalledWith("Users", {
            email: "user.name+tag@example.co.uk",
            active: true,
        });
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("400 si email complexe existe déjà", async () => {
        req = {
            body: {
                email: "user.name+tag@example.co.uk",
            },
        };
        spyOn(db, "findOne").and.resolveTo({
            success: true,
            result: {
                _id: "456",
                email: "user.name+tag@example.co.uk",
                active: true,
            },
        });
        await emailAlreadyUsed(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Email already used",
        });
        expect(next).not.toHaveBeenCalled();
    });
});
