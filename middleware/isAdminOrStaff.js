const User = require("../model/User");

const isAdminOrStaff = async (req, res, next) => {
  console.log("I am inside isAdminOrStaff middleware");

  try {
    const user = await User.findById(req.user_id);

    if (!user) {
      return res.status(403).json({ message: "User not found." });
    }

    // Allow access for both admin and staff users
    if (user.role === "admin" || user.role === "staff") {
      next(); // Proceed to the next middleware or controller
    } else {
      return res
        .status(403)
        .json({ message: "Access denied. Admin or Staff only." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = isAdminOrStaff;
