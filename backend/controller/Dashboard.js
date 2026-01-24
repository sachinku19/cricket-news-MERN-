const User=require("../model/user");
const News=require("../model/news");

const getAdminStats=async(req,res)=>{

    try{
        const totalUser=await User.countDocuments();
        const totalAdmin=await User.countDocuments({role:"admin"});
        const totalNews=await News.countDocuments();

        res.status(200).json({messgae:"Info",totalUser,totalAdmin,totalNews});
    }catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports={getAdminStats};