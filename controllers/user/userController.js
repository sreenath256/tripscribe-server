const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");



// To get user data on initial page load.
const getUserDataFirst = async (req, res) => {
  try {
    const token = req.cookies.user_token;
    if (!token) {
      throw Error("No token found");
    }

    const { _id } = jwt.verify(token, process.env.SECRET);

    const user = await User.findOne({ _id }, { password: 0 });

    if (!user) {
      throw Error("Cannot find user");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  getUserDataFirst,
  
};
