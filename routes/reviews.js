const express = require('express');

const router = express.Router({ mergeParams: true });  //NEED TO SET mergeParams to true so that we can access the campground ID FROM THE ROUTE

//Mongo
const Review = require('../models/review')
const campGround = require('../models/campground')

//Async Error handler:
const wrapAsync = require('../utils/catchAsync');

//Express Errors:
const AppError = require('../utils/AppError')

//Joi 
const { reviewSchema } = require('../schemas')

const validateLogIn = require('./middleware/validateLogIn');

const reviews = require('../controllers/reviews')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(400, msg)
    }
    else {
        next();
    }
}


router.post('/', validateLogIn, validateReview, wrapAsync(reviews.create))

router.delete('/:r_id', validateLogIn, wrapAsync(reviews.delete))

module.exports = router;