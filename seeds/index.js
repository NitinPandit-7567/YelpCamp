const { descriptors, places } = require('./seedHelpers.js')
const cities = require('./cities.js')
// console.log(places)
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp')
    .then(() => console.log('Connected to Mongo DB!!'))
    .catch((err) => { console.log('Error! Could not connect to Mongo DB! :(', err) })
const campGround = require('../models/campground')
const User = require('../models/user')

const mapbox = require('@mapbox/mapbox-sdk/services/geocoding')
const geocodingClient = mapbox({ accessToken: 'pk.eyJ1Ijoia2Vub2JpMjEyIiwiYSI6ImNsb253MXU5cDJzbTQyaXA5Y3FlazVvbjgifQ.29_B36Bh2Yvj4i49WyVj0w' })

const seedDB = async () => {
    await campGround.deleteMany({})
    for (let i = 0; i < 350; i++) {
        let descriptor = Math.floor(Math.random() * descriptors.length);
        let place = Math.floor(Math.random() * places.length);
        let city = Math.floor(Math.random() * cities.length);
        let title = descriptors[descriptor] + " " + places[place];
        let location = cities[city].city + ", " + cities[city].state;
        let longitude= cities[city].longitude;
        let latitude = cities[city].latitude;
        let price = Math.floor(Math.random() * 20) + 10;
        // let res = await geocodingClient.forwardGeocode({ query: location, limit: 1 }).send();
        // let geometry = res.body.features[0].geometry;
        const user = await User.findById('654377e7b1e160b5ef99a8d9');
        let cG = new campGround({
            title: title,
            location: location,
            // image: 'https://source.unsplash.com/collection/CwzKmWfZQtQ',
            // image: 'https://source.unsplash.com/collection/483251',
            // geometry: geometry,
            geometry: {
                type: 'Point',
                coordinates:[ 
                    longitude,latitude
                ]
            },
            images: [
            {
                path: "https://res.cloudinary.com/dfjaroh6g/image/upload/v1699278340/YelpCamp/afs7tkgrhvttsyh1iluw.jpg",
                file: "YelpCamp/afs7tkgrhvttsyh1iluw"
            },
            {

                path: "https://res.cloudinary.com/dfjaroh6g/image/upload/v1699278339/YelpCamp/g9fwdydq6mhkkprypirx.jpg",
                file: "YelpCamp/g9fwdydq6mhkkprypirx"
            }],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis consequatur, accusamus fugit porro maxime ab velit, aliquid modi, exercitationem corrupti doloribus fuga alias odio eius quas molestiae nemo excepturi! Vitae?',
            price: price,
            author: user
        })

        await cG.save().then(() => console.log(cG));

    }
}

seedDB();
