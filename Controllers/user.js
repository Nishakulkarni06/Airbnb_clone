const User = require("../models/User.js")
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

module.exports.post = async (req, res,next) => {
    try {
      let { username, email, password } = req.body;
      console.log(password);
      console.log(username);
      console.log(email);
  
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      });
    } catch (error) {
      req.flash("error", error.message);
      console.error("Error during registration:", error);
      res.redirect("/signup");
    }
  };

// module.exports.postLog =
// saveRedirectUrl,
// passport.authenticate("local", {
//   failureRedirect: "/login",
//   failureFlash: true,
// }),
// (req, res,next) => {
//   try{
//   req.flash("success", "Welcome Back To Wanderlust! ");
//   let redirectUrl = res.locals.redirectUrl || "/listings";
//   res.redirect(redirectUrl );
//   }catch(err){
//     console.log("error : ",err);
//     next(err); 
//   }
// }

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged out!");
    res.redirect("/listings");
  });
}