const request = require("supertest");
const { expect } = require("chai");
const { uniqueNamesGenerator, adjectives, names, colors } = require("unique-names-generator");

const { server } = require("../server");
const token = require("./authRouter.spec");

const locations = require("../models/json/location.json");
const sports = require("../models/json/sports.json");

const teamName = uniqueNamesGenerator({
  dictionaries: [adjectives, names, colors],
  separator: "",
});

describe("team router test", () => {
  it("GET : /team/query ", (done) => {
    const url = `
    /team
    ?province=${locations[0].province}
    &city=${locations[0].city}
    &district=${locations[0].district}
    &sports=${sports[0].sports}
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

  it("GET : /team/my ", (done) => {
    request(server)
      .get("/team/my")
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

  it("POST : /team ", (done) => {
    request(server)
      .post("/team")
      .set({ Authorization: token })
      .send({
        name: teamName,
        location: { id: "60b3bb31a8fd8f55a21f8266" },
        sports: { id: "60b3bb31a8fd8f55a21f8274" },
        imageS3: "https://minho-bucket.s3.ap-northeast-2.amazonaws.com/blank_profile.png",
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
