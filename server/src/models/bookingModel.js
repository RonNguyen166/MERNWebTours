import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    paid: {
      type: Boolean,
      default: true,
    },
    adults: Number,
    kids: Number,
    baby: Number,
    departure: {
      type: Date,
      default: Date.now,
    },
    payment: {
      type: mongoose.Schema.ObjectId,
      ref: "Payment",
      required: true,
    },
    status: {
      type: String,
      default: "pedding",
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "tour",
    select: "name",
  });
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
