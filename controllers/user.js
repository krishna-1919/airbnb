
const user=require("../models/user.js");

module.exports.rendersignupform=(req,res)=>{ 
    res.render("user/signup.ejs");
 }   



module.exports.signup=async(req,res)=>{ 
    try{
   let {username,email,password}=req.body;
 const newuser=new user({email,username});
 const registereduser=await user.register(newuser,password); 
 console.log(registereduser); 
 
 req.login(registereduser,(err)=>{ // this req.log in function is of passport this is use for automatacally login after signup 
    if(err){
       return next(err);
 } 
    req.flash("success","welcome to wanderlust!");
 res.redirect("/listings");
 })
 
    }
    catch(e){
       req.flash("error",e.message);
       res.redirect("/signup");
    }
 
  }   

 module.exports.renderloginform= (req,res)=>{
    res.render("user/login.ejs");
    }


  module.exports.login=async(req,res)=>{
        req.flash("success","welcome to back wanderlust"); 
        let redirecturl=res.locals.redirectUrl||"/listings";
     
        res.redirect(redirecturl);   
      }    


      module.exports.logout=(req,res,next)=>{
        req.logout((err)=>{   // this log out function is of passport predefined automatically they log out the user
           if(err){
              return next(err);
     
           }    
           req.flash("success","you are logged out");
           res.redirect("/listings");
        });
      }