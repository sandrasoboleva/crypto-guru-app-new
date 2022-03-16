const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");

// Routes
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const trade = require("./routes/api/trade");

app.use(cors())

// let whitelist = [
//   "https://crypto-guru-app.herokuapp.com",
//   "http://localhost:3000",
//   "http://localhost:5000",
// ];
// let corsOptionsDelegate = function (req, callback) {
//   let corsOptions;
//   if (whitelist.indexOf(req.header("Origin")) !== -1) {
//     corsOptions = { origin: true };
//   } else {
//     corsOptions = { origin: false };
//   }
//   callback(null, corsOptions);
// };

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(
    "mongodb+srv://Sandra:Sandra@classtest.ffb79.mongodb.net/crypto-guru-app?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(passport.initialize());

require("./config/passport.js")(passport);

// app.use("/api/users", cors(corsOptionsDelegate), users);
// app.use("/api/profile", cors(corsOptionsDelegate), profile);
// app.use("/api/trade", cors(corsOptionsDelegate), trade);

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/trade", trade);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
