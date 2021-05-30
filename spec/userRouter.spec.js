const request = require("supertest");
const { expect } = require("chai");

const { server } = require("../server");
const token = require("./authRouter.spec");

const locations = require("../models/json/location.json");

describe("user router test", () => {
  it("POST : /user/location", (done) => {
    request(server)
      .post("/user/location")
      .set({ Authorization: token })
      .send({ locations: [locations[0], locations[1]] })
      .expect(200)
      .expect("Content-Type", /json/)
      .end((err, res) => {
        if (err) { return done(err) }

        const { message, data, error } = res.body;

        expect(message).to.equal("success");
        expect(error).to.equal(null);
        expect(data).to.equal(null);

        done();
      });
  });
});
