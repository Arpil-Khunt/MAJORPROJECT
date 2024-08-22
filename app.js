const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const ejs = require("ejs");
const path = require("path");

//set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//this is also valid way to render the ejs template
//app.set("views", "./views/listings");

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

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
});

app.get("/listings/show", (req, res) => {
  res.send("this is from the show route");
});

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 2000,
//     location: "Manvilas,Bhavnagar,Gujarat",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("Successful testing");
// });

app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
