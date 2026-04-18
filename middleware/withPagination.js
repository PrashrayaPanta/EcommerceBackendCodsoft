const paginate = require("../utils/pagination.js");



const withPagination = (model) =>{

    console.log("I am inside the with pagination");
    


    return async (req, res) =>{
        
        const limit = parseInt(req.query.limit) || 4;
        const page = parseInt(req.query.page) || 1;

        const result  =  await paginate(model, page, limit)

        res.status(200).json({ success: "true", result });

    }

}

module.exports = withPagination;