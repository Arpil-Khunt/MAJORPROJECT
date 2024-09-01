//common.js
const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");

app.use(cookieParser("secretcode"));

app.get("/getsignedcookies", (req, res) => {
  res.cookie("name", "arpil kumar", { signed: true });
  res.send("done!");
});

app.get("/verify", (req, res) => {
  res.send(req.signedCookies);
});

app.get("/greet", (req, res) => {
  let { name: username = "anonymous" } = req.cookies;
  res.send(`Hi, ${username}!`);
});

app.get("/getcookies", (req, res) => {
  res.cookie("greet", "hello");
  res.cookie("India", "Modi");
  res.cookie("USA", "Jo Biden");
  res.send("get the cookie!");
});

app.get("/", (req, res) => {
  console.log(req.cookies);
  res.send("Hi, I am root!");
});

app.use("/users", users);
app.use("/posts", posts);

app.listen("3000", () => {
  console.log("app is listening on 3000");
});
