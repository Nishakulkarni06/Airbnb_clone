if(process.env.NODE_ENV != 'production'){
  require("dotenv").config();
}

const express= require("express");
const app = express(); 
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema}= require("./Schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/User.js");
const bodyParser = require('body-parser');

const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const { cookie } = require("express/lib/response.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL ;

main()
.then(()=>{
    console.log("connected to DB");
})
.catch(()=>{
    console.log("error");
}); 

async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"Public")));

const store = MongoStore.create({
  mongoUrl : dbUrl,
  crypto:{
    secret:process.env.SECERET,
  },
  touchAfter : 24*3600,
})

store.on("error",()=>{
  console.log("error in connecting mongo sessin storage : ",err);
});

const sessionOptions ={
  store,
  secret:process.env.SECERET,
  resave: false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true 
  }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next(); 
}); 

app.get("/demouser",async(req,res)=>{
  let fakeUser = new User ({
    email:"student@gmail.com",
    username:"delta-student"
  }); 

  let registeredUser = await User.register(fakeUser,"helloworld");
  res.send(registeredUser);
})


// app.get("/",(req,res)=>{
//   res.send("root file");
// });


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter)
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
  next(new ExpressError("Page Not Found!",404));
})

app.use((err,req,res,next)=>{
  let {statusCode=500,message="something went wrong"}=err;
  res.status(statusCode).render("error.ejs",{message});
})

app.listen(8080,()=>{
console.log("connected");
});