import mongoose from "mongoose";

const locationSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    coordidates: {
      type: [Number],
      required: true,
    },
    day: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Location = mongoose.model("Location", locationSchema);

export default Location;
