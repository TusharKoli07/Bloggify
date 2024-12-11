const { validateToken } = require("../Services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    // console.log("Token from cookie:", tokenCookieValue);


    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
      // console.log("User authenticated:", req.user); // Log user payload
    } catch (error) {
       console.log("Token validation failed:", error.message);
    }
    return next();
  };
}
module.exports = {
  checkForAuthenticationCookie,
};
