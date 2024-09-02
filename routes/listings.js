const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schemaValidation.js");
const Listing = require("../models/listing.js");

//validation for listing schema-------serverside
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  })
);

//New route
router.get(
  "/new",
  wrapAsync((req, res) => {
    res.render("./listings/new.ejs");
  })
);

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
  })
);

//Create route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let { title, description, price, image, country, location } = req.body;
    // console.log(title, description, price, image, country, location);

    //handle the bad request means if listing is not available then how you store listing in the database
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "send valid data for listing");
    // }

    //validate the serverside schema validation using Joi npm package
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if (result.error) {
    //   throw new ExpressError(400, result.error);
    // }
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    await newListing.save();
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
  })
);

//Edit route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
  })
);

//Update route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "send valid data for listing");
    }
    let { id } = req.params;
    let listing = req.body.listing;
    await Listing.findByIdAndUpdate(id, listing);
    req.flash("success", "update successfully!");
    res.redirect(`/listings/${id}`);
  })
);

//Delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "delete listing successfully!");
    res.redirect("/listings");
  })
);

module.exports = router;
