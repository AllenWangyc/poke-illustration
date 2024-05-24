import mongoose from "mongoose";
import { VALID_TYPES } from "./types.js";

const Schema = mongoose.Schema;

// TODO Your code here.
const speciesSchema = new Schema({
  dexNumber: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true
  },
  dexEntry: {
    type: String,
    required: true
  },
  types: [{
    type: String,
    enum: VALID_TYPES
  }]
}, {
  timestamps: {}
})

speciesSchema.index({ name: "text", dexEntry: "text" })

const Species = mongoose.model('Species', speciesSchema)

export { Species }
