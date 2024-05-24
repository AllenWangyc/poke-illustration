import express from "express";
import { Species } from "../../data/schema.js";

const router = express.Router();

// TODO Your code here.
const retrieveAllSpecies = async () => {
  return await Species.find()
}

router.get('/', async (req, res) => {
  const allSpecies = await retrieveAllSpecies()
  if (allSpecies) return res.json(allSpecies)
  return res.sendStatus(400)
})

export default router;
