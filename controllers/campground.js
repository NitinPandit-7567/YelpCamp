
const campGround = require('../models/campground')
const { cloudinary } = require('../Cloudinary/index')
const mapbox = require('@mapbox/mapbox-sdk/services/geocoding')
const geocodingClient = mapbox({ accessToken: process.env.MAPBOX_TOKEN })
module.exports.index = async (req, res) => {
    const allCG = await campGround.find({});
    // console.log(allCG);
    res.render('campgrounds/index', { allCG });
}

module.exports.create = async (req, res) => {
    // res.send(req.body)
    // const { title, price, description, location } = req.body;
    // const cg = new campGround({
    //     title: title,
    //     price: price,
    //     description: description,
    //     location: location
    // })
    // if (!req.campGround) {
    //     throw new AppError(400, 'INVALID DATA')
    // }
    req.body.campground.author = req.user._id;
    const cg = new campGround(req.body.campground);
    cg.images = req.files.map(f => ({ path: f.path, file: f.filename }))
    const loc = await geocodingClient.forwardGeocode({ query: req.body.campground.location, limit: 1 }).send();
    cg.geometry = loc.body.features[0].geometry;
    console.log(cg);
    // console.log(loc.body.features[0].geometry.coordinates)
    await cg.save();
    req.flash('success', 'Successfully created a new Campground!!');
    res.redirect(`/campgrounds/${cg._id}`)
}

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.editForm = async (req, res, next) => {
    const { id } = req.params;
    const cg = await campGround.findById(id);
    if (!cg) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { cg });
}

module.exports.update = async (req, res, next) => {
    // const { title, price, description, location } = req.body.campground;
    const { id } = req.params;
    console.log(req.body)
    const images = req.files.map(f => ({ path: f.path, file: f.filename }))
    const cg = await campGround.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });
    cg.images.push(...images);
    await cg.save();
    if (req.body.deleteImages) {
        for (let file of req.body.deleteImages) {
            cloudinary.uploader.destroy(file)
        }

        await cg.updateOne({ $pull: { images: { file: { $in: req.body.deleteImages } } } });
        console.log(cg);
    }
    // console.log("Updated Campground: \n", cg)
    req.flash('success', 'Successfully updated the Campground!!')
    res.redirect(`/ campgrounds / ${cg._id}`);
}

module.exports.delete = async (req, res, next) => {
    const { id } = req.params;
    await campGround.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the Campground!!')
    res.redirect('/campgrounds');
}

module.exports.show = async (req, res, next) => {
    const { id } = req.params;
    const cg = await campGround.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!cg) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { cg });
}