// routes/user.js
const { Router } = require("express");
const User = require("../models/User.js");
const router = Router();

// Render the signup page
router.get("/signup", (req, res) => {
  return res.render("signup");
});

// Render the signin page
router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Await the asynchronous function to get the token
    const token = await User.matchPasswordAndGenerateToken(email, password);

    // Log the token
    console.log("Generated Token:", token);
   

    return  res.cookie("authToken", token).redirect("/"); // Redirect after successfully signing in
  } catch (error) {
    return res.render(
      "signin",
      {
        error: "Incorrect Email or Password",
      } // Send error response
    );
  }
});

// Handle the signup form submission
router.post("/sign up", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    await User.create({ fullName, email, password });
    return res.redirect("/"); // Redirect after successful signup
  } catch (error) {
    console.error("Error creating user:", error); // Log the error
    return res.status(500).send("Internal Server Error"); // Send error response
  }
});

router.get("/logout", (req,res)=> {
  res.cookie("authToken").redirect("/");
}) ;

module.exports = router;

// const { Router } = require("express");
// const User = require("../Models/User.js");
// const router = Router();

// router.get("/signin", (req, res) => {
//   return res.render("signin");
// });

// router.get("/signup", (req, res) => {
//   return res.render("signup");
// });

// router.post("/signup", async (req, res) => {
//     const { fullName, email, password } = req.body;

//     try {
//       await User.create({
//         fullName,
//         email,
//         password,
//       });
//       return res.redirect("/"); // Ensure a response is sent back
//     } catch (error) {
//       console.error("Error creating user:", error); // Log the error
//       return res.status(500).send("Internal Server Error"); // Send error response
//     }
//   });

// module.exports = router;
