const express = require("express");
const router = express.Router();

//Posts
//INDEX- post
router.get("/", (req, res) => {
  res.send("GET for posts");
});
//SHOW - post
router.get("/:id", (req, res) => {
  res.send("GET for post id");
});

//POST - post
router.post("/", (req, res) => {
  res.send("POST posts");
});

//DELETE - post
router.delete("/:id", (req, res) => {
  res.send("delete for posts id");
});

module.exports = router;
