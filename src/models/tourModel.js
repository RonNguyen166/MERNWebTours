import mongoose from "mongoose";
import slugify from "slugify";

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: 50,
      minLength: 5,
    },
    slug: String,
    duration: {
      type: Number,
      required: true,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: {
        values: ["Dễ", "Trung bình", "Khó"],
        massage: "Mức độ Khó khăn là 'Dễ' , 'Trung bình' hoặc 'Khó'",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    priceDiscount: {
      type: Number,
      validate(val) {
        console.log(this.price);
        if (val >= this.price)
          throw new Error(
            "Discount price ({VALUE}) should be below regular price"
          );
      },
    },
    summary: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    active: {
      type: Boolean,
      default: true,
    },
    location: {
      type: String,
      required: true,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    upper: true,
    locale: "vi",
    trim: true,
  });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({ path: "guides", select: "-__v -passwordChangedAt" });
  next();
});

tourSchema.pre(/^findOneAnd/, async function (next) {
  this.price = await this.clone().findOne().price;
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
