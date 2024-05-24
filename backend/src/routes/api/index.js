import express from "express";

const router = express.Router();

import apiSpecies from "./api-species.js";
router.use("/species", apiSpecies);

import apiTypes from "./api-types.js";
router.use("/types", apiTypes);

export default router;
