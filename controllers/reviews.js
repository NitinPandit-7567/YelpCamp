const campGround = require('../models/campground')
const Review = require('../models/review')
module.exports.create = async (req, res, next) => {
    const { id } = req.params;
    console.log(req.params)
    const cg = await campGround.findById(id);
    const { rating, body } = req.body.review;
    const author = req.user;
    const review = new Review({ body, rating, author })
    console.log(cg)
    cg.reviews.push(review);
    await review.save();
    await cg.save();
    req.flash('success', 'Posted a new review successfully!')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.delete = async (req, res, next) => {
    const { id, r_id } = req.params;
    const review = await Review.findById(r_id).populate('author');
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized for this activity!')
        return res.redirect(`'/campgrounds/${id}'`)
    }
    await campGround.findByIdAndUpdate(id, { $pull: { reviews: r_id } })
    await Review.findByIdAndDelete(r_id);
    req.flash('success', 'Deleted a review successfully!')
    res.redirect(`/campgrounds/${id}`);

}