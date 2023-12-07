module.exports = function (req, res, next) {
    console.log('Req.User: ', req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login')
    }
    next()
}
