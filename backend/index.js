const express=require("express");
const cors=require("cors");
const connectDB = require("./config/db");
const path=require("path");
require("dotenv").config();

//routes
const UserRoutes=require("./routes/user");
const NewsRouter=require("./routes/news");
const adminRoute=require("./routes/Admin");
const cricketRouter=require("./routes/cricket");

//make appp
const app=express();



//middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));


//db connection
connectDB();


app.use("/api/auth",UserRoutes);
app.use("/api/news",NewsRouter);
app.use("/api/admin",adminRoute);
app.use("/api/cricket",cricketRouter);

app.get("/",async(req,res)=>{
    res.json({message:"hai"})
})


app.listen(process.env.PORT || 5000,()=>console.log(`server started on ${process.env.PORT}`));
