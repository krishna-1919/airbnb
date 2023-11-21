// if(process.env.NODE_ENV!="production"){
  // require("dotenv").config();  //dotenv package is use for acces the secret in backend.  
// }
// console.log(process.env.SECRET); 

const express=require("express");  
const router=express.Router();    
const wrapasync=require("../utils/wrapasync.js");   
const {listingschema}=require("../schema.js");    
const expresserror=require("../utils/expresserror.js");
const listing=require("../models/listing.js"); 
const {isloggedin}=require("../middleware.js");  // this is the middleware for checking the user was not log in or not in wanderlust 
const {isowner}=require("../middleware.js");  // this is use for only that user have a autherization edit and delete this is the middlware 
  


const listingcontroller=require("../controllers/listing.js");         
 const multer=require("multer");              
const {storage}=require("../cloudconfig.js");        
 const upload=multer({storage});    


 // this is the use for new route and update route for no anyone can save empty data in backend in mongodb if no data erite error will throw 

 const validatelisting = (req, res, next) => { 
   let { error } = listingschema.validate(req.body); 
   console.log(error);
   if (error) {
     let errMsg = error.details.map((el) => el.message).join(",");
  
     console.log("🔥 Error " + errMsg); 
    
   } else { next()}}; 


   
//index route
router.
route("/")
.get(wrapasync(listingcontroller.index))
.post(isloggedin,upload.single("listing[image]"),validatelisting,
wrapasync(listingcontroller.createlisting) ); 

 
  
 //get to create a new 
 
 router.get("/new",isloggedin,listingcontroller.rendernewform); //isloggdin is function to check user was login or not in wanderlust
  
    

 // show in detailed route 
 router.get("/:id",wrapasync(listingcontroller.showlisting)); 
 

 
 //post the new listing
 // router.//post("/",validatelisting,wrapasync(listingcontroller.createlisting));  
 
 

 //edit route
 router.get("/:id/edit",isloggedin,isowner,wrapasync(listingcontroller.rendereditform)); 
 
 
  //update route 
 router.put("/:id",isloggedin,isowner,upload.single("listing[image]"),validatelisting,wrapasync(listingcontroller.updatelisting)); 
  
  

 //delete the list
 router.delete("/:id",isloggedin,isowner,wrapasync(listingcontroller.destroylisting));  

    module.exports=router;