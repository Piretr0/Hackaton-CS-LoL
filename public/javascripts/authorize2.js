const isadmin2 = (req,res,next)=>
{
    if(!req.session.admin)
        next()
        else {
            res.redirect('/adminPage')
        }

}
module.exports=isadmin2