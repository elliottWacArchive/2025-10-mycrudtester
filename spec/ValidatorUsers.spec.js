const {
    validateLoginBody,
} = require("../middlewares/validators/users/loginBody");
const {
    validateRegisterBody,
} = require("../middlewares/validators/users/registerBody");
const {
    validateUpdateBody,
} = require("../middlewares/validators/users/updateBody");

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
