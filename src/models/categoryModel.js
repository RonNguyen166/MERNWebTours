import mongoose from "mongoose";
const CategorySchema = mongoose.Schema({
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
  },
});

const Category = mongoose.model("Category", CategorySchema);
export default Category;
