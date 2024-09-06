const Listing = require("../models/listing.js");

//listings route

//index route
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

//new route
module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

//show route
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "createdBy" } })
    .populate("owner");
  let userId = listing.owner._id;
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing, userId });
};

//create route
module.exports.createListing = async (req, res, next) => {
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
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing created!");
  res.redirect("/listings");
};

//edit route
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("./listings/edit.ejs", { listing });
};

//update route
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "update successfully!");
  res.redirect(`/listings/${id}`);
};

//delete route
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "delete listing successfully!");
  res.redirect("/listings");
};
