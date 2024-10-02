const Review = require("./models/review");

module.exports.isLoggedIn = (req,res,next)=>{
    if (!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; 
        req.flash("error","you must be logged in !");
        return res.redirect("/login");
    }
    next(); 
} 

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next(); 
};

// module.exports.isReviewAuthor = async(req,res)=>{
//  let {id,reviewId} = req.params;
//  let review = await Review.findById(reviewId);
//  if (!review.author.equals(res.locals.currUser._id)){
//     req.flash("error","You are not the author");
//     return res.redirect(`/listings/${id}`);
//  }
//  next();  
// };


module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;

    // Ensure that currUser exists and is logged in
    if (!res.locals.currUser) {
        req.flash('error', 'You must be logged in to perform this action.');
        return res.redirect('/login');
    }

    try {
        const review = await Review.findById(reviewId); // Await the promise

        // Ensure the review exists
        if (!review) {
            req.flash('error', 'Review not found.');
            return res.redirect('back');
        }

        // Check if the logged-in user is the author of the review
        if (!review.author.equals(res.locals.currUser._id)) {
            req.flash('error', 'You do not have permission to do that.');
            return res.redirect('back');
        }

        next(); // Proceed to the next middleware if everything is fine
    } catch (error) {
        // Handle any errors that occur during the database operation
        req.flash('error', 'An error occurred while checking the review.');
        return res.redirect('back');
    }
};
