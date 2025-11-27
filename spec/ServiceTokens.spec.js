const jwt = require("jsonwebtoken");
const { tokenGenerator } = require("../services/tokens/tokenGenerator");
// Services

describe("tokenGenerator", () => {
    const payload = { userId: 1 };
    beforeEach(() => {
        process.env.JWT_SECRET = "test";
    });

    it("appelle jwt.sign avec expiresIn par defaut", () => {
        spyOn(jwt, "sign").and.returnValue("generated-token");
        const token = tokenGenerator(payload);
        expect(jwt.sign).toHaveBeenCalledWith(payload, "test", {
            expiresIn: "1d",
        });
        expect(token).toBe("generated-token");
    });

    it("appelle jwt.sign avec expiresIn personnalise", () => {
        spyOn(jwt, "sign").and.returnValue("generated-token");
        const token = tokenGenerator(payload, "2h");
        expect(jwt.sign).toHaveBeenCalledWith(payload, "test", {
            expiresIn: "2h",
        });
        expect(token).toBe("generated-token");
    });

    it("throw si content est string", () => {
        expect(() => tokenGenerator("payload")).toThrowError();
    });

    it("throw si content est int", () => {
        expect(() => tokenGenerator(123)).toThrowError();
    });

    it("throw si content est null", () => {
        expect(() => tokenGenerator(null)).toThrowError();
    });

    it("throw si content est undefined", () => {
        expect(() => tokenGenerator(undefined)).toThrowError();
    });

    it("throw si content est objet vide", () => {
        const result = tokenGenerator({});
        expect(result).toBeDefined();
    });

    it("throw si content est array", () => {
        expect(() => tokenGenerator([])).toThrowError();
    });

    it("throw si expiresIn est int", () => {
        expect(() => tokenGenerator(payload, 123)).toThrowError();
    });

    it("throw si expiresIn est null", () => {
        expect(() => tokenGenerator(payload, null)).toThrowError();
    });

    it("throw si expiresIn est objet", () => {
        expect(() => tokenGenerator(payload, {})).toThrowError();
    });

    it("throw si expiresIn est boolean", () => {
        expect(() => tokenGenerator(payload, false)).toThrowError();
    });

    it("propage l'erreur si jwt.sign throw", () => {
        spyOn(jwt, "sign").and.callFake(() => {
            throw new Error("error");
        });
        expect(() => tokenGenerator(payload)).toThrowError("error");
    });

    it("propage l'erreur si JWT_SECRET manque", () => {
        delete process.env.JWT_SECRET;
        spyOn(jwt, "sign").and.callFake(() => {
            throw new Error("pas de jwt secret");
        });
        expect(() => tokenGenerator(payload)).toThrowError("pas de jwt secret");
    });
});
