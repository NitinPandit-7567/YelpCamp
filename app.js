if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
console.log(process.env.CLOUDINARY_CLOUD_NAME)
const express = require('express');
const app = express();
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const mongoose = require('mongoose')
const campGround = require('./models/campground')
const Review = require('./models/review')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');
const campgroundsRouter = require('./routes/campgrounds')
const reviewsRouter = require('./routes/reviews')
const userRouter = require('./routes/user')
const AppError = require('./utils/AppError')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
const MongoStore = require('connect-mongo')
const secret = process.env.SECRET || 'jedi'
//***************************************************************************/
const dbURL = process.env.DB_URL
// const dbURL = 'mongodb://127.0.0.1:27017/YelpCamp'
mongoose.connect(dbURL)
    .then(() => console.log('Connected to Mongo DB!!'))
    .catch((err) => { console.log('Error! Could not connect to Mongo DB! :(', err) })

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate)

// const store = new MongoStore({
//     url: dbUrl
// })

const store = MongoStore.create({
    mongoUrl: dbURL,
    touchAfter: 24 * 3600,
    crypto: {
        secret
    }
})

store.on("error", function (e) {
    console.log("SESSION STORE ERROR: ", e)
})
const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        name: 'session',
        httpOnly: true,
        // secure: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: (1000 * 60 * 60 * 24 * 7)
    }
}
app.use(session(sessionConfig))
app.use(flash());
// app.use(helmet({ contentSecurityPolicy: false }))
app.use(helmet())
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dfjaroh6g/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use(mongoSanitize())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'nitin@gmail.com', username: 'nitinn' });
    const newUser = await User.register(user, 'pro')
    res.send(newUser)
})
app.use('/campgrounds', campgroundsRouter)
app.use('/campgrounds/:id/reviews', reviewsRouter)
app.use('/', userRouter)

app.get('/', (req, res) => {
    res.render('home')
})
app.all('*', (req, res, next) => {
    next(new AppError(404, 'ERROR 404 : PAGE NOT FOUND'))
})

app.use((err, req, res, next) => {
    console.dir(err)
    if (err.name === 'TypeError') {
        err.message = `Please enter the correct value for the field ${err.path}`
        console.log("HERE: ", err.message)
    }
    const { status = 500, message = 'UH-OH SOMETHING WENT WRONG! :(' } = err;
    res.status(status).render('error', { status: status, message: message, stack: err.stack });
})
app.listen(3000, () => {
    console.log('ON PORT 3000....')
})
