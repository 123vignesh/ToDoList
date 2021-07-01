let request = require("supertest");
let app = require("../src/app");
const fs = require("fs");
const chai = require("chai");
const expect = chai.expect;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const readData = path => {
  return new Promise((res, rej) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        rej("Error in reading"+err);
      } else {
        res(data);
      }
    });
  });
};

describe("Session tests #start_test:", function() {
  it("should check signup page #end_test", function(done) {
    const date = new Date();
    const unique = date.getTime();
    request(app)
      .post("/signup")
      .set("Accept", "application/json")
      .send({ name: unique+"John Wick", email: unique+"john@wick.com", password: unique+"mydog<3" })
      .end(async function(err, res) {
        if (err) return done(err);

        const wget = require("wget-improved");
        const src = "http://localhost:4000";
        const output = "./profile.html";
        let download = await wget.download(src, output)
        download.on('end', function(output) {
          readData("./profile.html").then(res => {
            const create_data = res;
            const dom = new JSDOM(create_data);
            expect(
              dom.window.document.getElementsByTagName("input").length
            ).to.equal(2);
            done();
          }).catch(err=>{
            console.log("Error in reading file =>", err);
          });
        });
      });
  });
});

