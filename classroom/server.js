//common.js
const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.set("views", "./views");

const sessionOption = {
  secret: "supersecretestring",
  saveUninitialized: true,
  resave: false,
};
app.use(session(sessionOption));
app.use(flash());

// app.get("/flash", (req, res) => {
//   req.flash("info", "Flash is back!");
//   console.log(req.session);
//   console.log(req.flash());
//   res.redirect("/register");
// });
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  next();
});

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  if (name === "anonymous") {
    req.flash("error", "user not registered!");
  } else {
    req.flash("success", "user registered successfully!");
  }

  res.redirect("/hello");
});
app.get("/hello", (req, res) => {
  // console.log(req.session);
  let name = req.session.name;
  res.locals.messages = req.flash("success");
  res.render("page.ejs", { name });
});

// app.get("/reqcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`you sent a request ${req.session.count} time`);
// });
app.get("/test", (req, res) => {
  res.send("testing successful!");
});

//const cookieParser = require("cookie-parser");

// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookies", (req, res) => {
//   res.cookie("name", "arpil kumar", { signed: true });
//   res.send("done!");
// });

// app.get("/verify", (req, res) => {
//   res.send(req.signedCookies);
// });

// app.get("/greet", (req, res) => {
//   let { name: username = "anonymous" } = req.cookies;
//   res.send(`Hi, ${username}!`);
// });

// app.get("/getcookies", (req, res) => {
//   res.cookie("greet", "hello");
//   res.cookie("India", "Modi");
//   res.cookie("USA", "Jo Biden");
//   res.send("get the cookie!");
// });

// app.get("/", (req, res) => {
//   console.log(req.cookies);
//   res.send("Hi, I am root!");
// });

app.use("/users", users);
app.use("/posts", posts);

app.listen("3000", () => {
  console.log("app is listening on 3000");
});
