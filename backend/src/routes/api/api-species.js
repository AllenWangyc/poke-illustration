import express from "express";
import { Species } from "../../data/schema.js";

const router = express.Router();

// TODO Your code here.

router.get('/', async (req, res) => {
  try {
    const { type, text, page, resultsPerPage } = req.query
    let filter = {}
    let options = {}

    // handle with filter parameters
    if (type) {
      filter.types = type
    }

    if (text) {
      filter.$text = { $search: text }
    }

    // handle with options parameters, set the limit default value to 20
    let limit = 20
    if (resultsPerPage) {
      const resultsNum = parseInt(resultsPerPage, 10)
      if (isNaN(resultsNum) || resultsNum <= 0) {
        return res.status(422).json(error)
      }
      limit = resultsNum
    }

    let skip = 0
    if (page) {
      const pageNum = parseInt(page, 10)
      if (isNaN(pageNum) || pageNum < 0) {
        return res.status(422).json(error)
      }
      skip = pageNum * limit
      options = { limit, skip }
    }

    const results = await Species.find(filter, null, options)
    res.json(results)
  } catch (error) {
    res.status(400).send(error)
  }
})

export default router;