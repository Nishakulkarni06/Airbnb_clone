const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userData = require("../Controllers/user.js")

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});


router.post("/signup", userData.post);

router.get("/login",
(req, res) => {
  res.render("users/login.ejs");
  }
);


router.post(
  "/login",
  // saveRedirectUrl,
  // userData.postLog
  saveRedirectUrl,
  passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true,
}),
(req, res,next) => {
  try{
  req.flash("success", "Welcome Back To Wanderlust! ");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl );
  }catch(err){
    console.log("error : ",err);
    next(err); 
  }
}
);

router.get("/logout",userData.logout );

module.exports = router;
