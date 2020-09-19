const express = require("express");
// const env = require("dotenv");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const port = process.env.PORT || 8080;

const mongoose = require("mongoose");

const issueRoutes = require("./src/routes/issueroute");

//environment configuration
// env.config();

app.use(bodyParser());

//Handling Cors
app.use(cors());

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

//Routes Using
app.use("/api", issueRoutes);

//Static file to get

if (process.env.NODE_ENV === "production") {
  app.use(express.static("/client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Server listen
app.listen(port, () => console.log(`Serveer is running on port ${port}!`));

module.exports = app;
