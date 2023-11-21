const listing=require("../models/listing");



module.exports.index=async(req,res)=>{
    const alllistings=await listing.find({});
    res.render("listings/index.ejs",{alllistings});
  }   


module.exports.rendernewform=(req,res)=>{   //isloggdin is function to check user was login or not in wanderlust
 
    res.render("listings/new.ejs");  
    
  }   


  module.exports.showlisting=async(req,res)=>{ 
    let {id}=req.params;  
    const  onelisting=await listing.findById(id)
    .populate({
      path:"reviews",    // polpulate is use for use to refrence id detailed information 
      populate:{
      path:"author",
      },
     })
       .populate("owner");  

    if(!onelisting){    
      req.flash("error","Listing you requested for does not exists!");
      res.redirect("/listings");
  
    }
    res.render("listings/show.ejs",{onelisting});
 }



 module.exports.createlisting=async (req,res,next)=>{ 
   let url=req.file.path;  
     let filename=req.file.filename; 
    // console.log(url,filename);
    const newlisting=new listing(req.body.listing); 
       newlisting.owner=req.user._id; // this is use for add the current user add listing user name help by req.user through the passport 
       newlisting.image={url,filename}; 
      
       await newlisting.save(); 
       req.flash("success","New listing created ! ");
       res.redirect("/listings");
   }
   
   
 
 module.exports.rendereditform=async(req,res)=>{ 
    let {id}=req.params;
    const  elisting=await listing.findById(id);  
    if(!elisting){    
      req.flash("error","Listing you requested for does not exists!");
      res.redirect("/listings");

    }
    res.render("listings/edit.ejs",{elisting});
  } 


 module.exports.updatelisting= async(req,res)=>{  //isloggdin is function to check user was login or not in wanderlust
    if(!req.body.listing){ 
       throw new expresserror(400,"send valid data for listing"); 
    }
      
    let {id}=req.params;
    
    let llisting=await listing.findByIdAndUpdate(id,{...req.body.listing});
     
    if(typeof req.file!=="undefined"){
    let url=req.file.path;  
     let filename=req.file.filename; 
     llisting.image={url,filename}; 
     await llisting.save(); 
    }
    req.flash("success"," listing updated ! ");
    res.redirect(`/listings/${id}`);
 }


 module.exports.destroylisting=async(req,res)=>{  //isloggdin is function to check user was login or not in wanderlustr 
 
    let {id}=req.params;
    let deletelisting=await listing.findByIdAndDelete(id);
    req.flash("success","listing deleted ! ");
    res.redirect("/listings");
    
    }