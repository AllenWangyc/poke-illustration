import express from "express";
import { Species } from "../../data/schema.js";

const router = express.Router();

// TODO Your code here.
router.get('/', async (req, res) => {
  try {
    const { type, text } = req.query
    let query = {}

    if (type) {
      query.types = type
    }

    if (text) {
      query.$text = { $search: text }
    }

    const results = await Species.find(query)
    res.json(results)
  } catch (error) {
    res.status(400).send(error)
  }
})

export default router;
