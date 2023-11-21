const express=require("express");     
const app=express();   
const mongoose=require("mongoose");

const path=require("path"); 
const ejs=require("ejs"); 
const methodoverride=require("method-override"); // post,patch,put run 
const ejsmate=require("ejs-mate"); 
const expresserror=require("./utils/expresserror.js"); // this is for show error 
const listingsrouter=require("./router/listing.js"); // this is for use he router
const userrouter=require("./router/user.js"); // this is for use he router
const reviewsrouter=require("./router/review.js");// this is for use he router
const session=require("express-session");// for cookies 
const flash=require("connect-flash");// this is for flash the msg after any kind of data adding or update etc
const passport=require("passport");
const localstratergy=require("passport-local");  
const user=require("./models/user.js");
const mongostore=require("connect-mongo");  // this is use for create the mongo store 



// const mongourl="mongodb://127.0.0.1:27017/airanb";
 
const dburl=process.env.ATLASDB_URL;    // this is use for link the db in mongoatlas 
                                                                                                                   
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");   
app.use(express.urlencoded({extended:true}));  //for parsing the data by urlencoded but not the files 
app.use(methodoverride("_method")); 
app.engine("ejs",ejsmate); 
app.use(express.static(path.join(__dirname,"/public")));

// this is for after 24hours you cant have relogin .
const store=mongostore.create({
   mongoUrl:dburl,
   crypto:{
      secret:process.env.SECRET,

   }, 
   touchAfter:24*3600,
});  

// this is for error if no any error came in session id .

store.on("error",()=>{
   console.log("error in mongo session store " ,err);
});

// this is cookies
const sessionoptions={  
   store,
   secret:process.env.SECRET,
   resave:false,
   saveUninitialized:true,   
   cookie:{
      expires:Date.now()+7*24*60*60*1000,
      maxAge:7*24*60*60*1000,
      httpOnly:true
   },
};
 



main().then(()=>{
   console.log("connected to db");

}).catch((err)=>{
   console.log(err);
});

async function main(){
   await mongoose.connect(dburl);
}

// app.get("/",(req,res)=>{
//    res.send("hii iam a root");
// }); 
   


app.use(session(sessionoptions)); // for cookies 
app.use(flash()); // this is for flash msg printing . 


// this is for passport
app.use(passport.initialize());// a middleware intialize for passport
app.use(passport.session()); // this is for user have not to do repetedly login sign up .
passport.use(new localstratergy(user.authenticate())); 

passport.serializeUser(user.serializeUser());  // this is for session id not delted
passport.deserializeUser(user.deserializeUser());// this is for to delted the session id 

// this is middleware for flash 
app.use ((req,res,next)=>{
    res.locals.success=req.flash("success"); 
    res.locals.error=req.flash("error");  
    res.locals.curruser=req.user;    // this locals are use to send the data ejs templates 
                        // req.user ue for show signup or login or log out in wanderlusr
                     // req.user show data of current user login or not 
  next();
   });

app.use("/listings",listingsrouter);
app.use("/listings/:id/reviews",reviewsrouter); 
app.use("",userrouter);  




   app.all("*",(req,res,next)=>{
      next(new expresserror(404,"page not found"));
   });


 app.use((err,req,res,next)=>{ 
   let{statuscode=500,message="something went wrong"}=err; 
   res.status(statuscode).render("listings/error.ejs",{message});  



   // res.status(statuscode).send(message);
 });


app.listen(8080,()=>{
   console.log("server is listining on 8080 port");
}); 