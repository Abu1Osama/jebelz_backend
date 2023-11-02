const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/user.model");
router.post("/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).send({ msg: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      username,
    });

    await user.save();

    res.status(201).send({ msg: "User created successfully." });
  } catch (error) {
    res.status(500).send({msg: error.message })
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ msg: "User not found." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send({ msg: "Invalid password." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.send({ token, user,msg:"User Login Sucessfully" });
  } catch (error) {
    res.status(500).send({msg: error.message })
  }
});

module.exports = router;
