const { campgroundSchema } = require('../../schemas.js')
const AppError = require('../../utils/AppError')
module.exports = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(400, msg)
    }
    else {
        next();
    }
}