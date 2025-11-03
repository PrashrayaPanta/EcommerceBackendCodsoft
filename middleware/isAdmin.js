const User = require("../model/User");

const isAdmin = async (req, res, next) => {
  console.log("I am inside isAdmin middleware");

  try {
    const user = await User.findById(req.user_id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next(); // Proceed to the next middleware or controller
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = isAdmin;
