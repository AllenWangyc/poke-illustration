import express from "express";
import { VALID_TYPES } from "../../data/types.js";

const router = express.Router();

/**
 * GET /api/types: Returns a JSON array of all types in the VALID_TYPES array.
 *
 * This data is used by the frontend's search box, to populate its <select> component's <options>.
 */
router.get("/", (req, res) => res.json(VALID_TYPES));

export default router;
