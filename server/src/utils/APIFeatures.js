export default class APIFeatures {
  queryString;
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFieds = ["page", "sortBy", "limit", "fields"];
    excludedFieds.forEach((el) => delete queryObj[el]);
    // regex
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    const sortBy =
      this.queryString.sortBy && this.queryString.sortBy.split(",").join(" ");
    this.query = this.query.sort(sortBy || "-createdAt");
    return this;
  }

  limitFields() {
    const fields =
      this.queryString.fields && this.queryString.fields.split(",").join(" ");
    this.query = this.query.select(fields || "-__v");

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
