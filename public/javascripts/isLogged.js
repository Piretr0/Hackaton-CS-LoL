const isLogged = (req, res, next) => {
    if (!req.session.admin)
        next()
    else {
        res.redirect('/adminPage')
    }

}
module.exports = isLogged