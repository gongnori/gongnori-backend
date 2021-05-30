const request = require("supertest");
const { expect } = require("chai");
const { server } = require("../server");

describe("application router test", () => {
  it("GET : /application ", (done) => {
    request(server)
      .get("/application")
      .expect(200)
      .expect("Content-Type", /json/)
      .end((err, res) => {
        if (err) { return done(err) }

        const { message, data, error } = res.body;

        expect(message).to.equal("success");
        expect(error).to.equal(null);
        expect(data.locations).to.exist;
        expect(data.sports).to.exist;
        expect(data.playgrounds).to.exist;

        done();
      });
  });
});
