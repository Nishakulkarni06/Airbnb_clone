const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../Schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

const listingData = require("../Controllers/listings.js")
const {storage} = require("../CloudConfig.js");
const multer  = require('multer');
const upload = multer({ storage}) ;
// Validation middleware for listing
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError( errMsg,400)); // Pass error to next middleware
  }
  next(); // Call next if validation passes
};

router
.route("/")
.get(
wrapAsync(listingData.index)
)
.post(        //create route
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing, // Validate before creating
  wrapAsync(listingData.create)
);


router.get(
  "/category/:category",
  listingData.category 
)

// New listing route
router.get("/new", isLoggedIn,listingData.new);

// Edit listing route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingData.edit) 
);

router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  wrapAsync(listingData.update) 
);

// Delete listing route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(listingData.delete) 
)

// Show listing route
router.get("/:id",listingData.show)


module.exports = router;
