const express=require("express");
const { userSignup, userLogin, getUserProfile } = require("../controller/user");

const router=express.Router();


router.post("/signup",userSignup);
router.post("/login",userLogin);
router.get("/:id",getUserProfile);

module.exports=router;