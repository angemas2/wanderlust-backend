const request = require("supertest");
const users = require("../routes/users");

it("POST signin", async () => {
  const res = await request(users).post("/signin").send({
    username: "angemas",
    password: "test123",
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
});
