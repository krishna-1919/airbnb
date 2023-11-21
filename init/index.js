const mongoose=require("mongoose");
const initdata=require("./data.js");
const listing=require("../models/listing.js");

const mongourl="mongodb://127.0.0.1:27017/airanb"; 

main().then(()=>{
    console.log("connected to db ");
}) .catch((err)=>{    
     console.log("err");
  }); 

async function main(){
    await mongoose.connect(mongourl);
}   

const initdb=async()=>{
    await listing.deleteMany(); 
     initdata.data=initdata.data.map((obj)=>({...obj,owner:"654e15910f1cd1b2cc8b7557"}));
    await listing.insertMany(initdata.data);
    console.log("data is initaialized");
} 

initdb(); 