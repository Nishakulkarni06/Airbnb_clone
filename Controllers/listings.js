const Listing = require("../models/listing");
const review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");



module.exports.category = async (req, res, next) => {
    try {
        const category = req.params.category;
        const listings = await Listing.find({ category });
        console.log(listings)
        res.render('listings/category.ejs', { listings ,category}); // Make sure your view is named 'category.ejs'
    } catch (error) {
        console.error('Error fetching listings by category:', error);
        res.status(500).send('Server error');
    }
};


module.exports.index = async (req, res,next) => {
    try {
      const allListings = await Listing.find({});
      res.render("listings/index.ejs", { allListings });
    } catch (err) {
      // res.render("error", { message: "An error occurred" });
      console.error("Error fetching listings:", err);
        return next(new ExpressError("Internal Server Error", 500));
    }
  } 

module.exports.new = async  (req, res) => {
    res.render("listings/new.ejs");
    console.log("new page opened")
}  

module.exports.create = async (req, res, next) => {
  try {
    let url = req.file.path;
    let filename =req.file.filename;
    let {id}  = res.locals.currUser; 
    console.log(url,"..",filename);
      const newListing = new Listing(req.body.listing);
      newListing.image = {url,filename}; 
      newListing.owner = id ; 
      await newListing.save();
      req.flash("success", "New Listing Added");



      return res.redirect("/listings"); // Use return to prevent further execution
  } catch (err) {
      console.error("Error adding new listing:", err);
      // Pass the error to the next middleware
      return next(new ExpressError("Internal Server Error", 500));
  }
};

//   module.exports.edit = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
//         if (!listing) {
//             req.flash("error", "Listing not found");
//             return res.redirect("/listings");
//         }
//         if(typeof req.file != "undefined"){
//           let url = req.file.path;
//           let filename = req.file.filename;
//           listing.image = {url,filename};
//           await listing.save(); 
//          }
//         if (!listing.owner.equals(res.locals.currUser._id)) {
//             req.flash("error", "You don't have permission to edit this listing");
//             return res.redirect(`/listings/${id}`);
//         }
//         res.render("listings/edit.ejs", { listing });
//     } catch (err) {
//         console.error("Error fetching listing for edit:", err);
//         next(new ExpressError("Internal Server Error", 500));
//     }
// };

module.exports.edit = async (req, res, next) => {
  try {
      const { id } = req.params;
      const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

      if (!listing) {
          req.flash("error", "Listing not found");
          return res.redirect("/listings");
      }

      if (typeof req.file !== "undefined") {
          let url = req.file.path;
          let filename = req.file.filename;
          listing.image = { url, filename };
          await listing.save();
      }

      if ( !listing.owner.equals(res.locals.currUser._id)) {
          req.flash("error", "You don't have permission to edit this listing");
          return res.redirect(`/listings/${id}`);
      }

      if (String(listing.owner) !== String(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to edit this listing");
        return res.redirect(`/listings/${id}`);
    }
    

      res.render("listings/edit.ejs", { listing });
  } catch (err) {
      console.error("Error fetching listing for edit:", err);
      next(new ExpressError("Internal Server Error", 500));
  }
};


  module.exports.update = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to update this listing");
        return res.redirect(`/listings/${id}`);
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Updated Listing successfully!");
    res.redirect(`/listings/${id}`);
};


  module.exports.delete = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id); // Fetch the listing
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    if (listing.owner._id.toHexString() != res.locals.currUser._id) {
        req.flash("error", "You don't have permission to delete this listing");
        return res.redirect(`/listings/${id}`);
    }
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Deleted Listing successfully");
    res.redirect("/listings");
};


  module.exports.show = async (req, res, next) => {
    try {
      const { id } = req.params;
      const listing = await Listing.findById(id)
        .populate({
          path: "reviews",
          populate: {
            path: "author"
          },
        })
        .populate("owner");

      if (!listing) {
        return next(new ExpressError("Listing not found", 404));
      }
      res.render("listings/show.ejs", { listing });
    } catch (error) {
      console.error("Error fetching listing:", error);
      next(new ExpressError("Internal Server Error", 500));
    }
  }

