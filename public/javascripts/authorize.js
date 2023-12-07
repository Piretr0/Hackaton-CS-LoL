const { register } = require("../../models");
async function isadmin(req, res, next) {
    if (req.session.admin) {

        const checklogin = await register.findOne({
                where: { id: req.session.yId },

            },


        )

        req.session.nick = checklogin.login;
        req.session.edit = checklogin.edit;
        req.session.add = checklogin.add;
        req.session.delete = checklogin.delete;
        req.session.power = checklogin.power;
        global.uprEdit = req.session.edit,
            global.uprAdd = req.session.add,
            global.uprDelete = req.session.delete,
            global.Moc = req.session.power,
            global.yNick = req.session.nick;

        next()
    } else {
        res.redirect('/login')
    }

}

module.exports = isadmin