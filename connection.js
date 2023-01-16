const mongoose = require("mongoose");
require("dotenv").config();

// mongoose.connect(
//   `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@nodeexpressprojects.gncjanv.mongodb.net/NODEEXPRESSPROJECTS?retryWrites=true&w=majority`,
//   () => console.log("DB Connected")
// );

// mongoose.connect(process.env.ATLAS_URI, () => console.log("DB Connected"));

const URL = process.env.ATLAS_URI;
mongoose.connect(
  // `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6gqw5kc.mongodb.net/?retryWrites=true&w=majority`,
  URL,
  () => console.log("DB Connected")
);
