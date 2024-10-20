const { UnauthenticatedError } = require("../errors");

const verifyRoles = async (req, res, next) => {
  if (!req.user.isAdmin)
    throw new UnauthenticatedError("Only Admins are allowed");

  next();
};

module.exports = verifyRoles;
