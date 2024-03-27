const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");

const mongoose = require("mongoose");

const app = express();
const PORT = 8000;

mongoose
  .connect("mongodb://127.0.0.1:27017/blogify")
  .then((e) => console.log("MongoDB Connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//this middleware is for form data
app.use(express.urlencoded({ extended: false }));

app.use("/user", userRoute);
app.get("/", (req, res) => {
  res.render("home");
});

app.listen(PORT, () => {
  console.log("server running on port " + `${PORT}`);
});
