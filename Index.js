const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookiePaser = require("cookie-parser");


const userRoute = require("./Routes/User.js");
const { checkForAuthenticationCookie } = require("./Middleware/authentication");// Ensure this file exists
const blogRoute = require("./Routes/blog.js");

const Blogs = require("./Models/blog" );

const app = express();
const PORT = 8000;

mongoose
  .connect("mongodb://localhost:27017/Blogify")
  .then((e) => console.log("MongoDb Connected.."));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("authToken"));
app.use(express.static(path.resolve("./Public")));
app.use('/Blog/Src/Images', express.static(path.join(__dirname, 'Src', 'Images')));



app.get("/", async (req, res) => {
  const allBlogs= await Blogs.find({}).sort('createdAt -1');
  res.render("HomePage", {
     user: req.user, 
     blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server in running at PORT: ${PORT}`));
