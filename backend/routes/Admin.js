const express=require("express");
const { getAdminStats } = require("../controller/Dashboard");

const router=express.Router();

router.get("/stats",getAdminStats);

module.exports=router;