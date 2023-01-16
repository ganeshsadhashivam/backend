const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const BlogPost = require("./BlogPost");
const UserSchema = new mongoose.Schema({
  // name: {
  //   type: String,
  //   required: [true, "Can't be blank"],
  // },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Can't be blank"],
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "is Invalid",
    ],
    index: true,
  },
  password: {
    type: String,
    required: [true, "Can't be blank"],
  },
  tokens: [],
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }],
});

UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  //if user being created or updated
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.articles;
  return userObject;
};

//Token generation

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  console.log("user is", user);
  const token = jsonwebtoken.sign({ _id: user._id.toString() }, "appSecret");
  console.log(token);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid Email or Password");
  const isMatch = await bcrypt.compare(password, user.password);
  //if there is a match
  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
