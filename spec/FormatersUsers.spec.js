const {
    formatRegisterBody,
} = require("../middlewares/formaters/users/registerBody");
const { formatLoginBody } = require("../middlewares/formaters/users/loginBody");
const {
    formatUpdateBody,
} = require("../middlewares/formaters/users/updateBody");

const makeRes = () => {
    const res = {};
    res.status = jasmine.createSpy("status").and.callFake(() => res);
    res.send = jasmine.createSpy("send");
    return res;
};

describe("formatRegisterBody", () => {
    let req, res, next;

    beforeEach(() => {
        res = makeRes();
        next = jasmine.createSpy("next");
    });

    it("transforme email en lowercase et trim", () => {
        req = {
            body: {
                email: "  TEST@EXAMPLE.COM  ",
                username: "testuser",
                password: "password123",
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.email).toBe("test@example.com");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("trim username", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "  testuser  ",
                password: "password123",
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.username).toBe("testuser");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("password reste inchangé", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
                password: "  password123  ",
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.password).toBe("  password123  ");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email reste null si null", () => {
        req = {
            body: {
                email: null,
                username: "testuser",
                password: "password123",
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.email).toBeNull();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email reste undefined si undefined", () => {
        req = {
            body: {
                email: undefined,
                username: "testuser",
                password: "password123",
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.email).toBeUndefined();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email reste nombre si nombre", () => {
        req = {
            body: {
                email: 12345,
                username: "testuser",
                password: "password123",
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.email).toBe(12345);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email reste objet si objet", () => {
        req = {
            body: {
                email: { test: "value" },
                username: "testuser",
                password: "password123",
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.email).toEqual({ test: "value" });
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email reste array si array", () => {
        req = {
            body: {
                email: ["test@example.com"],
                username: "testuser",
                password: "password123",
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.email).toEqual(["test@example.com"]);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("username reste null si null", () => {
        req = {
            body: {
                email: "test@example.com",
                username: null,
                password: "password123",
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.username).toBeNull();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("username reste undefined si undefined", () => {
        req = {
            body: {
                email: "test@example.com",
                username: undefined,
                password: "password123",
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.username).toBeUndefined();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("username reste nombre si nombre", () => {
        req = {
            body: {
                email: "test@example.com",
                username: 12345,
                password: "password123",
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.username).toBe(12345);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("username reste objet si objet", () => {
        req = {
            body: {
                email: "test@example.com",
                username: { name: "test" },
                password: "password123",
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.username).toEqual({ name: "test" });
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email string vide reste string vide après trim", () => {
        req = {
            body: {
                email: "   ",
                username: "testuser",
                password: "password123",
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.email).toBe("");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("username string vide reste string vide après trim", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "   ",
                password: "password123",
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.username).toBe("");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email avec espaces multiples devient trim", () => {
        req = {
            body: {
                email: "    TEST@EXAMPLE.COM    ",
                username: "testuser",
                password: "password123",
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.email).toBe("test@example.com");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("username avec tabs devient trim", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "\t\ttestuser\t\t",
                password: "password123",
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.username).toBe("testuser");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email avec newlines devient trim", () => {
        req = {
            body: {
                email: "\n\nTEST@EXAMPLE.COM\n\n",
                username: "testuser",
                password: "password123",
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.email).toBe("test@example.com");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("tous les champs manquent", () => {
        req = {
            body: {},
        };
        formatRegisterBody(req, res, next);
        expect(req.body.email).toBeUndefined();
        expect(req.body.username).toBeUndefined();
        expect(req.body.password).toBeUndefined();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("password null reste null", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
                password: null,
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.password).toBeNull();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("password undefined reste undefined", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
                password: undefined,
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.password).toBeUndefined();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("password nombre reste nombre", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
                password: 12345,
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.password).toBe(12345);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("password objet reste objet", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
                password: { pass: "test" },
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.password).toEqual({ pass: "test" });
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email et username avec caractères spéciaux", () => {
        req = {
            body: {
                email: "  TEST+TAG@EXAMPLE.COM  ",
                username: "  test_user-123  ",
                password: "password123",
            },
        };
        formatRegisterBody(req, res, next);
        expect(req.body.email).toBe("test+tag@example.com");
        expect(req.body.username).toBe("test_user-123");
        expect(next).toHaveBeenCalledTimes(1);
    });
});

describe("formatLoginBody", () => {
    let req, res, next;

    beforeEach(() => {
        res = makeRes();
        next = jasmine.createSpy("next");
    });

    it("transforme email en lowercase et trim", () => {
        req = {
            body: {
                email: "  TEST@EXAMPLE.COM  ",
                password: "password123",
            },
        };
        formatLoginBody(req, res, next);
        expect(req.body.email).toBe("test@example.com");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("password reste inchangé", () => {
        req = {
            body: {
                email: "test@example.com",
                password: "  password123  ",
            },
        };
        formatLoginBody(req, res, next);
        expect(req.body.password).toBe("  password123  ");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email reste null si null", () => {
        req = {
            body: {
                email: null,
                password: "password123",
            },
        };
        formatLoginBody(req, res, next);
        expect(req.body.email).toBeNull();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email reste undefined si undefined", () => {
        req = {
            body: {
                email: undefined,
                password: "password123",
            },
        };
        formatLoginBody(req, res, next);
        expect(req.body.email).toBeUndefined();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email reste nombre si nombre", () => {
        req = {
            body: {
                email: 12345,
                password: "password123",
            },
        };
        formatLoginBody(req, res, next);
        expect(req.body.email).toBe(12345);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email reste objet si objet", () => {
        req = {
            body: {
                email: { test: "value" },
                password: "password123",
            },
        };
        formatLoginBody(req, res, next);
        expect(req.body.email).toEqual({ test: "value" });
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email reste array si array", () => {
        req = {
            body: {
                email: ["test@example.com"],
                password: "password123",
            },
        };
        formatLoginBody(req, res, next);
        expect(req.body.email).toEqual(["test@example.com"]);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email string vide reste string vide après trim", () => {
        req = {
            body: {
                email: "   ",
                password: "password123",
            },
        };
        formatLoginBody(req, res, next);
        expect(req.body.email).toBe("");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("password null reste null", () => {
        req = {
            body: {
                email: "test@example.com",
                password: null,
            },
        };
        formatLoginBody(req, res, next);
        expect(req.body.password).toBeNull();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("password undefined reste undefined", () => {
        req = {
            body: {
                email: "test@example.com",
                password: undefined,
            },
        };
        formatLoginBody(req, res, next);
        expect(req.body.password).toBeUndefined();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("password nombre reste nombre", () => {
        req = {
            body: {
                email: "test@example.com",
                password: 12345,
            },
        };
        formatLoginBody(req, res, next);
        expect(req.body.password).toBe(12345);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("password objet reste objet", () => {
        req = {
            body: {
                email: "test@example.com",
                password: { pass: "test" },
            },
        };
        formatLoginBody(req, res, next);
        expect(req.body.password).toEqual({ pass: "test" });
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("tous les champs manquent", () => {
        req = {
            body: {},
        };
        formatLoginBody(req, res, next);
        expect(req.body.email).toBeUndefined();
        expect(req.body.password).toBeUndefined();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email avec espaces multiples devient trim", () => {
        req = {
            body: {
                email: "    TEST@EXAMPLE.COM    ",
                password: "password123",
            },
        };
        formatLoginBody(req, res, next);
        expect(req.body.email).toBe("test@example.com");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email avec tabs devient trim", () => {
        req = {
            body: {
                email: "\t\tTEST@EXAMPLE.COM\t\t",
                password: "password123",
            },
        };
        formatLoginBody(req, res, next);
        expect(req.body.email).toBe("test@example.com");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email avec newlines devient trim", () => {
        req = {
            body: {
                email: "\n\nTEST@EXAMPLE.COM\n\n",
                password: "password123",
            },
        };
        formatLoginBody(req, res, next);
        expect(req.body.email).toBe("test@example.com");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email avec caractères spéciaux", () => {
        req = {
            body: {
                email: "  TEST+TAG@EXAMPLE.CO.UK  ",
                password: "password123",
            },
        };
        formatLoginBody(req, res, next);
        expect(req.body.email).toBe("test+tag@example.co.uk");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email avec underscores et dots", () => {
        req = {
            body: {
                email: "  USER_NAME.TEST@EXAMPLE.COM  ",
                password: "password123",
            },
        };
        formatLoginBody(req, res, next);
        expect(req.body.email).toBe("user_name.test@example.com");
        expect(next).toHaveBeenCalledTimes(1);
    });
});

describe("formatUpdateBody", () => {
    let req, res, next;

    beforeEach(() => {
        res = makeRes();
        next = jasmine.createSpy("next");
    });

    it("transforme email en lowercase et supprime espaces", () => {
        req = {
            body: {
                email: "  TEST @ EXAMPLE . COM  ",
                username: "testuser",
                password: "password123",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.email).toBe("test@example.com");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("supprime tabs de username et trim", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "\t\t  testuser  \t\t",
                password: "password123",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.username).toBe("testuser");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("password reste inchangé", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
                password: "  password123  ",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.password).toBe("  password123  ");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email reste null si null", () => {
        req = {
            body: {
                email: null,
                username: "testuser",
                password: "password123",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.email).toBeNull();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email reste undefined si undefined", () => {
        req = {
            body: {
                email: undefined,
                username: "testuser",
                password: "password123",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.email).toBeUndefined();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email reste nombre si nombre", () => {
        req = {
            body: {
                email: 12345,
                username: "testuser",
                password: "password123",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.email).toBe(12345);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email reste objet si objet", () => {
        req = {
            body: {
                email: { test: "value" },
                username: "testuser",
                password: "password123",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.email).toEqual({ test: "value" });
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("username reste null si null", () => {
        req = {
            body: {
                email: "test@example.com",
                username: null,
                password: "password123",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.username).toBeNull();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("username reste undefined si undefined", () => {
        req = {
            body: {
                email: "test@example.com",
                username: undefined,
                password: "password123",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.username).toBeUndefined();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("username reste nombre si nombre", () => {
        req = {
            body: {
                email: "test@example.com",
                username: 12345,
                password: "password123",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.username).toBe(12345);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email supprime tous les espaces internes", () => {
        req = {
            body: {
                email: "TEST   @   EXAMPLE   .   COM",
                username: "testuser",
                password: "password123",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.email).toBe("test@example.com");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email supprime tous les tabs", () => {
        req = {
            body: {
                email: "TEST\t@\tEXAMPLE\t.\tCOM",
                username: "testuser",
                password: "password123",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.email).toBe("test@example.com");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email supprime vertical tabs", () => {
        req = {
            body: {
                email: "TEST\v@\vEXAMPLE.COM",
                username: "testuser",
                password: "password123",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.email).toBe("test@example.com");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("username supprime tabs internes puis trim", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "  test\t\tuser  ",
                password: "password123",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.username).toBe("testuser");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("username supprime vertical tabs puis trim", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "  test\v\vuser  ",
                password: "password123",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.username).toBe("testuser");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email string vide avec espaces devient vide", () => {
        req = {
            body: {
                email: "     ",
                username: "testuser",
                password: "password123",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.email).toBe("");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("username string vide avec espaces devient vide", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "     ",
                password: "password123",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.username).toBe("");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("tous les champs manquent", () => {
        req = {
            body: {},
        };
        formatUpdateBody(req, res, next);
        expect(res.body.email).toBeUndefined();
        expect(res.body.username).toBeUndefined();
        expect(res.body.password).toBeUndefined();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("password null reste null", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
                password: null,
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.password).toBeNull();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("password undefined reste undefined", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
                password: undefined,
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.password).toBeUndefined();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("password objet reste objet", () => {
        req = {
            body: {
                email: "test@example.com",
                username: "testuser",
                password: { pass: "test" },
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.password).toEqual({ pass: "test" });
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email avec mix espaces tabs vertical tabs", () => {
        req = {
            body: {
                email: " \t\vTEST \t\v@ \t\vEXAMPLE.COM \t\v",
                username: "testuser",
                password: "password123",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.email).toBe("test@example.com");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("username avec mix espaces tabs vertical tabs", () => {
        req = {
            body: {
                email: "test@example.com",
                username: " \t\vtest \t\vuser \t\v",
                password: "password123",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.username).toBe("test user");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("email array reste array", () => {
        req = {
            body: {
                email: ["test@example.com"],
                username: "testuser",
                password: "password123",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.email).toEqual(["test@example.com"]);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("username objet reste objet", () => {
        req = {
            body: {
                email: "test@example.com",
                username: { name: "test" },
                password: "password123",
            },
        };
        formatUpdateBody(req, res, next);
        expect(res.body.username).toEqual({ name: "test" });
        expect(next).toHaveBeenCalledTimes(1);
    });
});
