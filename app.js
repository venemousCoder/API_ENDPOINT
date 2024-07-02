const express = require("express");
const dotenv = require("dotenv").config();
const path = require("path");
const router = require("./routes/index.js");
const cors = require("cors");


//app settings

const app = express();
app.use(cors())
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//server port
app.set("port", process.env.PORT || 8000);

//routes

app.use("/", router);

//server connection

app.listen(app.get("port"), (err) => {
    err ? console.log('this', err) : console.log("server listening at port " + app.get("port"));
});
