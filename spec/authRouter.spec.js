const request = require("supertest");
const { expect } = require("chai");
const jwt = require("jsonwebtoken");

const { server, db } = require("../server");

require("dotenv").config();

const NAME = "minho kwon";
const EMAIL = "minhob38@gmail.com";

const token = jwt.sign(
  { name: NAME, email: EMAIL },
  process.env.TOKEN_SECRET_KEY,
  { expiresIn: 60 },
);

describe("auth router test", () => {
  before((done) => {
    const checkDatabaseConnection = () => {
      if (db.readyState === 1) {
        done();
      } else {
        done("db disconnection");
      }
    };

    setTimeout(() => checkDatabaseConnection(), 3000);
  });

  it("POST : /auth/login", (done) => {
    request(server)
      .post("/auth/login")
      .send({
        name: NAME,
        email: EMAIL,
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .end((err, res) => {
        if (err) { return done(err) }

        const { message, data, error } = res.body;

        expect(message).to.equal("success");
        expect(error).to.equal(null);
        expect(jwt.verify(data.token, process.env.TOKEN_SECRET_KEY)).not.to.equal(null);
        expect(data.locations).to.be.instanceOf(Array);
        expect(data.teams).to.be.instanceOf(Array);
        expect(data.sports).to.be.instanceOf(Array);
        expect(data.messages).to.be.instanceOf(Array);

        done();
      });
  });
});

module.exports = token;
