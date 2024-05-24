/**
 * Note: Coverage likely not 100%, and your API will also be evaluated based on whether it behaves
 * when connected to your frontend. But if you get 100% pass rate here, that's a good indication
 * that your API is probably correct.
 */

import express from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import fs from "fs";
import mongoose from "mongoose";
import request from "supertest";
import { Species } from "../../../data/schema.js";
import routes from "../api-species.js";

let mongod;

const app = express();
app.use("/api/species", routes);

const dummyData = JSON.parse(fs.readFileSync("./src/routes/api/__tests__/species-test-data.json"));
const testSpecies = dummyData.map((s) => ({ ...s, _id: new mongoose.Types.ObjectId(s._id) }));

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const connectionString = mongod.getUri();
  await mongoose.connect(connectionString);
});

beforeEach(async () => {
  await Species.deleteMany({});
  await Species.bulkSave(testSpecies.map((s) => new Species(s)));
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("GET /api/species", () => {
  // Tests whether your API performs correctly with no querey parameters
  test("Can get a list of all species", (done) => {
    request(app)
      .get("/api/species")
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        // Expect 25 species returned
        expect(res.body.length).toBe(25);

        // For each one returned, there should be an equivalent species in the dummy data.
        const returnedNames = res.body.map((s) => s.name).sort();
        const dbNames = testSpecies.map((s) => s.name).sort();
        returnedNames.forEach((n, i) => expect(n).toEqual(dbNames[i]));

        return done();
      });
  });

  // Tests whether your API does type search correctly
  describe("GET /api/species?type=??", () => {
    test("Can get all grass types", (done) => {
      request(app)
        .get("/api/species?type=Grass")
        .send()
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          // Expect Bulbasaur, Ivysaur, and Venusaur
          expect(res.body.length).toBe(3);
          expect(res.body[0].name).toEqual("Bulbasaur");
          expect(res.body[1].name).toEqual("Ivysaur");
          expect(res.body[2].name).toEqual("Venusaur");

          return done();
        });
    });
  });

  // Tests whether your API does text search correctly
  describe("GET /api/species?text=??", () => {
    test("Can get a match based on a species name", (done) => {
      request(app)
        .get("/api/species?text=ivysaur")
        .send()
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          // Expect only ivysaur is returned
          expect(res.body.length).toBe(1);
          expect(res.body[0].name).toEqual("Ivysaur");

          return done();
        });
    });

    test("Can get a match based on dexEntry text", (done) => {
      request(app)
        .get("/api/species?text=prey")
        .send()
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          // Expect only Pidgeot, Pidgeotto, and Raticate. Order doesn't matter.
          expect(res.body.length).toBe(3);
          const returnedNames = res.body.map((s) => s.name).sort();
          expect(returnedNames[0]).toEqual("Pidgeot");
          expect(returnedNames[1]).toEqual("Pidgeotto");
          expect(returnedNames[2]).toEqual("Raticate");

          return done();
        });
    });
  });

  // Tests whether your API does type AND text search correctly at the same time
  describe("GET /api/species?text=??&type=??", () => {
    test("Can get a match based on dexEntry text AND type", (done) => {
      request(app)
        .get("/api/species?text=prey&type=Flying")
        .send()
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          // Expect Pidgeot and Pidgeotto. Order doesn't matter.
          expect(res.body.length).toBe(2);
          const returnedNames = res.body.map((s) => s.name).sort();
          expect(returnedNames[0]).toEqual("Pidgeot");
          expect(returnedNames[1]).toEqual("Pidgeotto");

          return done();
        });
    });
  });

  // Tests whether your API does pagination correctly, including both success and error cases.
  describe("GET /api/species?page=??&resultsPerPage=??", () => {
    test("Can get first page of paginated results with default resultsPerPage", (done) => {
      request(app)
        .get("/api/species?page=0")
        .send()
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          // Expect from Bulbasaur to Raticate is returned
          expect(res.body.length).toBe(20);
          expect(res.body[0].name).toBe("Bulbasaur");
          expect(res.body[19].name).toBe("Raticate");

          return done();
        });
    });

    test("Can get second page of paginated results with default resultsPerPage", (done) => {
      request(app)
        .get("/api/species?page=1")
        .send()
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          // Expect from Spearow to Pikachu is returned
          expect(res.body.length).toBe(5);
          expect(res.body[0].name).toBe("Spearow");
          expect(res.body[4].name).toBe("Pikachu");

          return done();
        });
    });

    test("Can get third page of paginated results with default resultsPerPage", (done) => {
      request(app)
        .get("/api/species?page=2")
        .send()
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          // Expect empty array is returned
          expect(res.body.length).toBe(0);

          return done();
        });
    });

    test("Can get first page of paginated results with custom resultsPerPage", (done) => {
      request(app)
        .get("/api/species?page=0&resultsPerPage=5")
        .send()
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          // Expect from Bulbasaur to Charmeleon is returned
          expect(res.body.length).toBe(5);
          expect(res.body[0].name).toBe("Bulbasaur");
          expect(res.body[4].name).toBe("Charmeleon");

          return done();
        });
    });

    test("Can get second page of paginated results with custom resultsPerPage", (done) => {
      request(app)
        .get("/api/species?page=1&resultsPerPage=5")
        .send()
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          // Expect from Charizard to Caterpie is returned
          expect(res.body.length).toBe(5);
          expect(res.body[0].name).toBe("Charizard");
          expect(res.body[4].name).toBe("Caterpie");

          return done();
        });
    });

    test("Get 422 response with negative page", (done) => {
      request(app).get("/api/species?page=-1").send().expect(422).end(done);
    });

    test("Get 422 response with non-integer page", (done) => {
      request(app).get("/api/species?page=notanumber").send().expect(422).end(done);
    });

    test("Get 422 response with resultsPerPage = 0", (done) => {
      request(app).get("/api/species?page=0&resultsPerPage=0").send().expect(422).end(done);
    });

    test("Get 422 response with resultsPerPage < 0", (done) => {
      request(app).get("/api/species?page=0&resultsPerPage=-1").send().expect(422).end(done);
    });

    test("Get 422 response with resultsPerPage not a number", (done) => {
      request(app)
        .get("/api/species?page=0&resultsPerPage=notanumber")
        .send()
        .expect(422)
        .end(done);
    });
  });

  // Tests whether your API does both search and pagination correctly at the same time
  describe("GET /api/species?text=??&type=??&page=??&resultsPerPage=??", () => {
    test("Behaves as expected when ALL query parameters are used and valid.", (done) => {
      request(app)
        .get("/api/species?text=prey&type=Flying&page=0&resultsPerPage=1")
        .send()
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          // Expect Pidgeotto OR Pidgeot to be returned (can't determine order)
          const names = ["Pidgeotto", "Pidgeot"];
          expect(res.body.length).toBe(1);
          expect(names.includes(res.body[0].name)).toBeTruthy();

          // Remove the one that we found from the array
          names.splice(names.indexOf(res.body[0].name), 1);

          // Do another request for page 2 - it should return the other result.
          request(app)
            .get("/api/species?text=prey&type=Flying&page=1&resultsPerPage=1")
            .send()
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);

              // Expect only Pidgeot OR Pidgeotto is returned (the other one, that wasn't returned before).
              expect(res.body.length).toBe(1);
              expect(res.body[0].name).toEqual(names[0]);

              return done();
            });
        });
    });
  });
});
