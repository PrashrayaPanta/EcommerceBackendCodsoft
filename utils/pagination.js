// utils/paginate.js
async function paginate(model, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const totalItems = await model.countDocuments();
  const data = await model.find().skip(skip).limit(limit);

  return {
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    data,
  };
}

module.exports = paginate;
