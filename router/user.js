const express=require("express");
const router=express.Router(); 
const wrapasync=require("../utils/wrapasync.js");
const user=require("../models/user.js"); 
const  passport=require("passport"); 
const {saveRedirectUrl} =require("../middleware.js");   //this is use for redirect the back url after login 
const usercontroller=require("../controllers/user.js"); 

router.get("/signup",usercontroller.rendersignupform);

router.post("/signup",wrapasync(usercontroller.signup));  

 router.get("/login",usercontroller.renderloginform); 




 router.post("/login",      
saveRedirectUrl,     
 passport.authenticate("local",                               //pasport authenticate was check user have signup or not first
 {failureRedirect:"/login",
 failureFlash:true,}),usercontroller.login);





 router.get("/logout",usercontroller.logout);

module.exports=router;