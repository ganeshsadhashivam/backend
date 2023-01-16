const router = require("express").Router();

const express = require("express");
const User = require("../models/User");
const authenticateUser = require("../middleware/authentication");

//user Creation
//users
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    console.log(user);
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (error) {
    let msg;
    if (error.code == 11000) {
      msg = "Email Already Exists";
    } else {
      msg = error.message;
    }
    res.status(400).json(msg);
  }
});

//Login user

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    console.log(user);
    const token = await user.generateAuthToken();
    res.json({ user, token });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//Logout User
router.delete("/logout", authenticateUser, async (req, res) => {
  try {
    console.log("in delete");
    req.user.tokens = req.user.tokens.filter((tokenObj) => {
      console.log(req.user.tokens);
      return tokenObj.token !== req.token;
    });
    await req.user.save();
    res.status(200).send();
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
