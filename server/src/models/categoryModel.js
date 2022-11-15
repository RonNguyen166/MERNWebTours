import mongoose from "mongoose";
import slugify from "slugify";
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    slug: String,
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    upper: true,
    locale: "vi",
    trim: true,
  });
  next();
});

const Category = mongoose.model("Categories", categorySchema);
export default Category;
