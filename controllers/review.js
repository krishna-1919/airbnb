
const listing=require("../models/listing.js");
const review=require("../models/review.js");

module.exports.createreview=async(req,res)=>{
    let onelisting=await listing.findById(req.params.id); 
    let newreview=new review(req.body.review);  
    newreview.author=req.user._id;
    onelisting.reviews.push(newreview);

    await newreview.save(); 
  await onelisting.save(); 
  req.flash("success"," review created ! ");
res.redirect(`/listings/${onelisting._id}`);


  }

  module.exports.destroyreview=async(req,res)=>{
    let {id,reviewId}=req.params;

    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});// this line use for deleting the review info from listing after delting the reviews 
    await review.findByIdAndDelete(reviewId); 
    req.flash("success","review deleted ! ");
    res.redirect(`/listings/${id}`);
 }

