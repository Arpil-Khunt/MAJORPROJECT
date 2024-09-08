const Listing = require("../models/listing.js");
//mapbox geocoding api to conver adderess into geographical coordinates longitude and latitude
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

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
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  let listing = req.body.listing;
  const newListing = new Listing(listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
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
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_150,w_200");
  res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

//update route
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
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
