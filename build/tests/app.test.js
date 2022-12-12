"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const request = require("supertest");
const users = require("../routes/users");
it("POST /users/signup", () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield request(users).post("/signup").send({
        username: "usertest",
        email: "john@gmail.com",
        password: "azerty123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
}));
