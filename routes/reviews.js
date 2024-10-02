const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema , reviewSchema}= require("../Schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const User = require("../models/User"); 
const reviewData =  require("../Controllers/review.js")

// reviews post route 
router.post("/",isLoggedIn, wrapAsync(reviewData.post));

// reviews delete route 

router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
wrapAsync(reviewData.delete)
);

module.exports = router ;  


