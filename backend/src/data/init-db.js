import * as dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import fs from "fs";
import { Species } from "./schema.js";

await mongoose.connect(process.env.DB_URL);
console.log("Connected to database!");
console.log();

await clearDatabase();
console.log();

await addSpecies();
console.log();

// Disconnect when complete
await mongoose.disconnect();
console.log("Disconnected from database!");

async function clearDatabase() {
  await Species.deleteMany();
  console.log("Database cleared");
}

async function addSpecies() {
  const speciesData = JSON.parse(fs.readFileSync("./src/data/species.json", { encoding: "utf-8" }));
  console.log(`${speciesData.length} species read from species.json`);
  const species = speciesData.map((s) => new Species(s));
  await Species.bulkSave(species);
  console.log("Species written to DB");
}
