const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("ATLAS CONNECTED");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });