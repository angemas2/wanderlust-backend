const request = require("supertest");
const users = require("../routes/users");

it("POST /users/signup", async () => {
  const res = await request(users).post("/signup").send({
    username: "usertest",
    email: "john@gmail.com",
    password: "azerty123",
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
});
