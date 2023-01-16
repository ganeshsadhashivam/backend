const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
require("./connection");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));

//routes
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.listen(5000, () => {
  console.log(`Server is Running`);
});
