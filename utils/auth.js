const withAuth = (req, res, next) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    next();
  }
};

module.exports = withAuth;

// when user accesses a url that a user needs to be logged in to access, they are redirected to login page