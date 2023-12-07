const express = require('express');
const router = express.Router();
//Async Error handler:
const wrapAsync = require('../utils/catchAsync');
//Express Errors:
const AppError = require('../utils/AppError')
//JOI:
// const Joi = require('joi')
const { campgroundSchema } = require('../schemas.js')
//Middleware:
const validateLogIn = require('./middleware/validateLogIn')
const validateAuthor = require('./middleware/validateAuthor')
const campgrounds = require('../controllers/campground')
const validateCampground = require('./middleware/validateCampground')
//Mongo
const campGround = require('../models/campground')
const { cloudinary, storage } = require('../Cloudinary') //dont have to specify index.js since node automatically searches for index.js
const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage })


router.route('/')
    .get(wrapAsync(campgrounds.index))
    .post(validateLogIn, upload.array('image'), validateCampground, wrapAsync(campgrounds.create))
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files)
//     res.send('DONE')
// })
router.get('/new', validateLogIn, campgrounds.newForm)
router.get('/:id/edit', validateLogIn, validateAuthor, wrapAsync(campgrounds.editForm))
router.route('/:id')
    .put(validateLogIn, validateAuthor, upload.array('image'), validateCampground, wrapAsync(campgrounds.update))
    .delete(validateLogIn, validateAuthor, wrapAsync(campgrounds.delete))
    .get(wrapAsync(campgrounds.show))


module.exports = router;