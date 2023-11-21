const express=require("express");
const router=express.Router({mergeParams:true}); // merge params is use for data is have or not in review and check in router
const wrapasync=require("../utils/wrapasync.js");
const {reviewschema}=require("../schema.js");
const expresserror=require("../utils/expresserror.js");
const review=require("../models/review.js");
const listing=require("../models/listing.js"); 
const {isloggedin}=require("../middleware.js");  // this is the middleware for checking the user was not log in or not in wanderlust  v
const {isreviewauthor}=require("../middleware.js");  
const listingcontroller=require("../controllers/review.js");  

// this is the use for review route for no anyone can save empty data in backend in mongodb if no data erite error will throw 
const validatereview=(req,res,next)=>{
    let {error}=reviewschema.validate(req.body); 
    if(error){
       let errmsg=error.details.map((error)=error.message).join(",");
 throw new expresserror(400,errmsg);
 
    }   
    else{
       next();
    }
 };
 
   //reviews post route 
   router.post("/",isloggedin,validatereview,wrapasync(listingcontroller.createreview)); 

  //review delete route 

  router.delete("/:reviewId",isloggedin,isreviewauthor,wrapasync(listingcontroller.destroyreview))
  

module.exports=router;