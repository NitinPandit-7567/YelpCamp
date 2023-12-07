const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp').then(() => console.log('Connected to Mongo DB!!'))
//     .catch((err) => { console.log('Error! Could not connect to Mongo DB! :(', err) })
const opt = { toJSON: { virtuals: true } };
const Review = require('./review')
const User = require('./user')
const imageSchema = new mongoose.Schema({
    path: String,
    file: String
})
imageSchema.virtual('thumbnail').get(function () {
    return this.path.replace('/upload', '/upload/w_200')
})

const campGroundSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        min: 0,
        default: 0
    },
    description: {
        type: String,
    },
    location: {
        type: String,
        required: true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [
        // {path: {
        //     type: String,
        //     // required: true
        // },
        // file: {
        //     type: String,
        //     // required: true
        // }
        // 
        imageSchema
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]

},opt)

campGroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<h6>Campground: <a href='/campgrounds/${this._id}'>${this.title}</a></h6>`
})

campGroundSchema.post('findOneAndDelete', async (cg) => {
    for (let i of cg.reviews) {
        await Review.findByIdAndDelete(i._id)
    }
    console.log(cg)
})

// campGroundSchema.post('findOneAndDelete', async (cg) => {
//     if (cg) {
//         await Review.remove({
//             _id: { $in: cg.reviews }
//         })
//     }
//     console.log(cg)
// })
const campGround = mongoose.model('CampGround', campGroundSchema)

module.exports = campGround;