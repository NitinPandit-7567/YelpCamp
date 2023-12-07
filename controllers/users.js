const User = require('../models/user')

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        console.log(req.body)
        const u = new User({ email, username });
        const registeredUser = await User.register(u, password);
        req.login(registeredUser, function (err) {
            if (err) { return next(err) }
            req.flash('success', 'Welcome to YelpCamp!')
            res.redirect('/campgrounds')
        })
    } catch (e) {
        console.dir(e)
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.registerForm = (req, res) => {
    res.render('users/register')
}

module.exports.loginForm = (req, res) => {
    res.render('users/login')
}

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You are successfully logged out, Goodbye!')
        res.redirect('/campgrounds')
    })
}

module.exports.login = (req, res, next) => {
    req.flash('success', 'Welcome back!')
    req.session.returnTo = res.locals.returnTo;
    const redirectUrl = req.session.returnTo ? req.session.returnTo : '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}