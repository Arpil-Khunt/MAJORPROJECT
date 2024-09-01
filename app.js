const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");

//set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
//this is also valid way to render the ejs template
//app.set("views", "./views/listings");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Hi, I am root.");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

//send a stadard response for all route, if there is not exist => * means all route if the route is exist then it match above if not then come this route it match all incoming route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});

//serverside custome error handling -> error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!" } = err;
  res.status(statusCode).render("./listings/error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
