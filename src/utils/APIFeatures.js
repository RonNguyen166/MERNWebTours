export default class APIFeatures {
  constructor(obj, query) {
    this.obj = obj;
    this.query = query;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFieds = ["page", "sort", "limit", "fields"];
    excludeFieds.forEach((el) => delete queryObj[el]);
    // regex

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // queryObj = JSON.parse(queryStr);
    // for (const prop in queryObj) {
    //   queryObj[prop] = new RegExp(queryObj[prop], "i");
    //   console.log(queryObj[prop]);
    // }
    // this.obj = this.obj.find(queryObj);
    this.obj = this.obj.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.query.sort) {
      const sortBy = this.query.sort.split(",").join(" ");
      this.obj = this.obj.sort(sortBy);
    } else {
      this.obj = this.obj.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.query.fields) {
      const fields = this.query.fields.split(",").join(" ");
      this.obj = this.obj.select(fields);
    } else {
      this.obj = this.obj.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.query.page * 1 || 1;
    const limit = this.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.obj = this.obj.skip(skip).limit(limit);
    return this;
  }
}
