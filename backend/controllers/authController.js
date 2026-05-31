const jwt = require("jsonwebtoken");

const { User } = require("../models/User");


// ---------------- GENERATE TOKEN ----------------
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};


// ---------------- LOGIN ----------------
const login = async (req, res) => {
  try {
    const {
      email,
      password,
      role,
    } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate role
    if (
      role &&
      user.role !== role
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Validate password
    // (Later we will use bcrypt)
    if (
      user.password !== password
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate token
    const token =
      generateToken(user);

    // Response
    return res.status(200).json({
      success: true,
      message:
        "Login successful",
      data: {
        token,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong",
    });
  }
};


// ---------------- GET CURRENT USER ----------------
const getCurrentUser = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user.id
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "User fetched successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error(
      "Get user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong",
    });
  }
};

module.exports = {
  login,
  getCurrentUser,
};