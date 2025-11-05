const bcrypt = require("bcrypt");
const { hashPassword } = require("../services/password/hashPassword");
const { verifyPassword } = require("../services/password/verifyPassword");

describe("hashPassword", () => {
    const password = "motdepassetressecure";

    it("retourne hash valide", async () => {
        spyOn(bcrypt, "hash").and.resolveTo("hashed-password");
        const res = await hashPassword(password);
        expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
        expect(res).toEqual({ success: true, hash: "hashed-password" });
    });

    it("retourne erreur quand bcrypt renvoie valeur nulle", async () => {
        spyOn(bcrypt, "hash").and.resolveTo(null);
        const res = await hashPassword(password);
        expect(res.success).toBeFalse();
        expect(res.message).toBe("Hashing password error");
    });

    it("retourne erreur quand bcrypt rejette", async () => {
        spyOn(bcrypt, "hash").and.rejectWith(new Error("Erreur bcrypt"));
        const res = await hashPassword(password);
        expect(res.success).toBeFalse();
        expect(res.message).toBe("Hashing password error");
    });
});

describe("verifyPassword", () => {
    const password = "motdepassetressecure";
    const hash = "hash-random-123";

    it("retourne true quand compareSync retourne true", async () => {
        spyOn(bcrypt, "compareSync").and.returnValue(true);
        const res = verifyPassword(password, hash);
        expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hash);
        expect(res).toEqual({ success: true });
    });

    it("retourne false quand compareSync retourne false", async () => {
        spyOn(bcrypt, "compareSync").and.returnValue(false);
        const res = verifyPassword(password, hash);
        expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hash);
        expect(res).toEqual({ success: false });
    });

    it("retourne false quand compareSync jette une erreur", async () => {
        spyOn(bcrypt, "compareSync").and.throwError("Erreur bcrypt");
        const res = verifyPassword(password, hash);
        expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hash);
        expect(res).toEqual({ success: false });
    });
});
