
const adminMiddleware=async(req,res,next)=>{

    if(req.user.role!=="admin"){
        return res.status(409).json({message:"Admin access only"});
    }
    next();
}

module.exports=adminMiddleware;