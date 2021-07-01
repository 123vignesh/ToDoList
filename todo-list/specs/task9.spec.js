let request = require("supertest");
let app = require("../src/app");
const assert = require("chai").assert;

var Cookies;

describe("Functional Test #start_test", function() {
  it("should create user session for valid user", function(done) {
    request(app)
      .post("/signin")
      .set("Accept", "application/json")
      .send({ email: "led@zeppelin.com", password: "stairwaytoheaven" })
      .end(function(err, res) {
        assert.equal(res.status, 302);
        let location = res.header["location"]
        // assert.equal(location, "/");
        done();
      });
  });
  it("should check signin", function(done) {
    request(app)
      .get("/signin")
      .set("Accept", "application/json")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });
  it("shouldn't create user session for invalid user #end_test", function(done) {
    request(app)
      .post("/signin")
      .set("Accept", "application/json")
      .send({ email: "linkin@park.com", password: "messi" })
          .end(function(err, res) {
            assert.equal(res.status, 302);
            let location = res.header["location"]
            // assert.equal(location, "/signin");
            done();
      });
  });
});

