const Listing = require("../models/listing");
const review = require("../models/review.js");
const Review = require("../models/review.js");

module.exports.post = async (req, res) => {
    try {
      let listing = await Listing.findById(req.params.id);
      let newReview = new Review(req.body.review);
      newReview.author = req.user._id; 
      console.log(newReview);
      listing.reviews.push(newReview);
      if(newReview.rating < 1 ){
        newReview.rating = 1 ;
      }

      await newReview.save();
      await listing.save();
   
      console.log("New review saved");
      res.redirect(`/listings/${listing._id}`);
      req.flash('success',"new review saved")
    } catch (e) {
      console.error("Error saving the review: ", e);
      res.status(500).send("Something went wrong. Review not saved.");
    }
  }

module.exports.delete = async(req,res)=>{
    let {id,reviewId} = req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{ reviews:reviewId }});
    await Review.findByIdAndDelete(reviewId); 
    req.flash('success',"Review deleted!")    
    res.redirect(`/listings/${id}`);
  }