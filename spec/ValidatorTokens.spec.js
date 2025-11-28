// Middlewares/validators
const {
    tokenVerifier,
} = require("../middlewares/validators/tokens/tokenVerifier");
const jwt = require("jsonwebtoken");

const makeRes = () => {
    const res = {};
    res.status = jasmine.createSpy("status").and.callFake(() => res);
    res.send = jasmine.createSpy("send");
    res.json = jasmine.createSpy("json");
    return res;
};

describe("tokenVerifier", () => {
    let req, res, next;
    beforeEach(() => {
        process.env.JWT_SECRET = "test";
        res = makeRes();
        next = jasmine.createSpy("next");
    });

    it("req.user + next() si token valide", () => {
        req = { headers: { authorization: "Bearer good.token" } };
        spyOn(jwt, "verify").and.returnValue({ id: 1, role: "user" });
        tokenVerifier(req, res, next);
        expect(jwt.verify).toHaveBeenCalledWith("good.token", "test");
        expect(req.user).toEqual({ id: 1, role: "user" });
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it("401 si pas de header Authorization", () => {
        req = { headers: {} };
        spyOn(jwt, "verify").and.returnValue({ id: 1 });
        tokenVerifier(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Invalid or missing token",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("401 si header Authorization sans Bearer", () => {
        req = { headers: { authorization: "token" } };
        spyOn(jwt, "verify").and.returnValue({ id: 1 });
        tokenVerifier(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Invalid or missing token",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("401 si header Authorization avec faux Bearer", () => {
        req = { headers: { authorization: "beerer token" } };
        spyOn(jwt, "verify").and.returnValue({ id: 1 });
        tokenVerifier(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Invalid or missing token",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("401 si header Authorization vide", () => {
        req = { headers: { authorization: " " } };
        spyOn(jwt, "verify").and.returnValue({ id: 1 });
        tokenVerifier(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Invalid or missing token",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("401 si authorization est null", () => {
        req = { headers: { authorization: null } };
        spyOn(jwt, "verify").and.returnValue({ id: 1 });
        tokenVerifier(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Invalid or missing token",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("401 si Bearer avec token vide", () => {
        req = { headers: { authorization: "Bearer " } };
        spyOn(jwt, "verify").and.returnValue({ id: 1 });
        tokenVerifier(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Invalid or missing token",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("401 si jwt.verify throw", () => {
        req = { headers: { authorization: "Bearer bad.token" } };
        spyOn(jwt, "verify").and.callFake(() => {
            throw new Error("error");
        });
        tokenVerifier(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({
            success: false,
            message: "Invalid or missing token",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("401 si plusieurs espaces après Bearer", () => {
        req = { headers: { authorization: "Bearer  good.token" } };
        spyOn(jwt, "verify").and.returnValue({ id: 1 });
        tokenVerifier(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it("ne définit pas req.user si token invalide", () => {
        req = { headers: { authorization: "Bearer bad.token" } };
        spyOn(jwt, "verify").and.callFake(() => {
            throw new Error("invalid");
        });
        tokenVerifier(req, res, next);
        expect(req.user).toBeUndefined();
        expect(next).not.toHaveBeenCalled();
    });
});
