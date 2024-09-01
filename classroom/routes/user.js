const express = require("express");
const router = express.Router();

//users
//INDEX- users
router.get("/", (req, res) => {
  res.send("GET for users");
});
//SHOW - users
router.get("/:id", (req, res) => {
  res.send("GET for users id");
});

//POST - users
router.post("/", (req, res) => {
  res.send("POST users");
});

//DELETE - users
router.delete("/:id", (req, res) => {
  res.send("delete for user id");
});

module.exports = router;
