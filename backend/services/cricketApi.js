const axios=require("axios");

const cricketAPI=axios.create({
    baseURL:"https://api.cricapi.com/v1",
    params:{
        apikey:process.env.CRICKET_API_KEY
    }
});

module.exports=cricketAPI;