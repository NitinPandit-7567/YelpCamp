const campGround = require('../../models/campground')
const AppError = require('../../utils/AppError')
module.exports = async function (req, res, next) {
    const { id } = req.params;
    const camp = await campGround.findById(id)
    if (!camp) {
        return next(new AppError('404', 'Not able to find the campground'))
    }
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized for this activity!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}