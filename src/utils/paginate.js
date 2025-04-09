export const paginate = async (model, query, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const results = await model.find(query).skip(skip).limit(limit);

    console.log("Result is: ",results)

    const total = await model.countDocuments(query);
    return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: results
    };
}