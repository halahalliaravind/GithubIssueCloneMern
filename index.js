const express = require("express");
const env = require("dotenv");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const mongoose = require("mongoose");

const issueRoutes = require("./src/routes/issueroute");

//environment configuration
env.config();

app.use(bodyParser());

//Handling Cors
app.use(cors());

//Routes Using
app.use("/api", issueRoutes);

// mongodb connection
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.q9fz3.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("MongoDB SuccessFully Connected!!");
  });

// Server listen
app.listen(process.env.PORT, () =>
  console.log(`Serveer is running on port ${process.env.PORT}!`)
);

module.exports = app;
