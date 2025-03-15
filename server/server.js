const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");

// SETUP
dotenv.config({path:"./server/.env"});
console.log("Loaded PORT:", process.env.PORT);

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser("secretcode"));

// DATABASE
const URI = process.env.MONGO_URI;
const connectDB = async () => {
  await mongoose.connect(URI)
}

connectDB()
  .then(() => {
    console.log("MongoDB connected")
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(() => {
    console.log("Cannot connect to DB")
  })

// ROUTES
const authRouter = require("./routes/authRoutes");
const dataRouter = require("./routes/dataRoutes");
const stockRouter = require("./routes/stockRoutes");

app.use("/api/auth", authRouter);
app.use("/api/data", dataRouter);
app.use("/api/stock", stockRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/../client/build/index.html"));
  });
}

// APP

