const request = require("supertest");
const itineraries=require("../routes/itineraries")

it("GET itineraries", async () => {
  const res = await request(itineraries).get("/bruxelles");

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
});
