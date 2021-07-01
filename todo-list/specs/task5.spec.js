let request = require("supertest");
let app = require("../src/app");
const assert = require("chai").assert;

var Cookies;

describe("Session tests #start_test:", function() {
  it("should check signin page", function(done) {
    request(app)
      .post("/signin")
      .set("Accept", "application/json")
      .send({ email: "led@zeppelin.com", password: "stairwaytoheaven" })
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.status, 302);
        let location = res.header["location"];
        Cookies = res.header["set-cookie"];
        // assert.equal(location, "/");
        assert.notEqual(Cookies, undefined);
        console.log("The Cookie: " + Cookies);
        done();
      });
  });
  it("should check signup page #end_test", function(done) {
    const date = new Date();
    const unique = date.getTime();
    request(app)
      .post("/signup")
      .set("Accept", "application/json")
      .send({
        name: unique+"Freddie Mercury",
        email: unique+"fred@merc.com",
        password: unique+"123"
      })
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.status, 302);
        let location = res.header["location"];
        // assert.equal(location, "/");
        Cookies = res.header["set-cookie"];
        assert.notEqual(Cookies, undefined);
        console.log("The Cookie: " + Cookies);
        done();
      });
  });
});

