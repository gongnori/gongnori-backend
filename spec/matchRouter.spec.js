const request = require("supertest");
const { expect } = require("chai");

const { server } = require("../server");
const token = require("./authRouter.spec");

const locations = require("../models/json/location.json");
const sports = require("../models/json/sports.json");

describe("match router test", () => {
  it("GET : /match/query ", (done) => {
    const url = `
    /match
    ?province=${locations[0].province}
    &city=${locations[0].city}
    &district=${locations[0].district}
    &sports=${sports[0].sports}
    &year=${new Date().getFullYear()}
    &month=${new Date().getMonth() + 1}
    &date=${new Date().getDate()}
    `;

    const _url = url.replace(/\n| /g, "");

    request(server)
      .get(encodeURI(_url))
      .set({ Authorization: token })
      .expect(200)
      .expect("Content-Type", /json/)
      .end((err, res) => {
        if (err) { return done(err) }

        const { message, data, error } = res.body;

        expect(message).to.equal("success");
        expect(error).to.equal(null);
        expect(data).to.be.instanceOf(Array);

        done();
      });
  });

  it("POST : /match ", (done) => {
    request(server)
      .post("/match")
      .set({ Authorization: token })
      .send({
        month: "6",
        date: "1",
        meridiem: "PM",
        start: "8",
        end: "10",
        playground: { id: "60b3bb31a8fd8f55a21f8272" },
        type: "5:5",
        sports: { id: "60b3bb31a8fd8f55a21f8274", name: "football" },
        team: { id: "60b3bb31a8fd8f55a21f8297" },
      })
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
