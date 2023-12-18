const express = require("express");
require("dotenv").config();
const session = require("express-session");
const mongoose = require("mongoose");
// const flash = require("connect-flash");
const cors = require("cors");
const morgan = require("morgan");
const nocache = require("nocache");
const app = express();
const router = require("./route/userrouter");
const routers = require("./route/adminrouter");
const path=require('path');

// const { checkOffer } = require("./util/cronjob");

app.use(nocache());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.set("view engine", "ejs");

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(morgan("tiny"));

app.use(
  cors({
    origin: "http://localhost:8080",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(404).render("user/pageNotFound");
});

app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname,'public/assets')))
// app.use(express.static("public"));

// app.use(flash());

app.use("/", router);

app.use("/admin", routers);
mongoose.connect(process.env.MONGOURL,{useNewUrlParser:true,useUnifiedTopology:false})
.then(()=>{
   console.log("Mongo connected succesfully");
})
.catch((err)=>{
   console.log("not connected",err);
})


// mongoose.connect(process.env.MONGO_URI).then(() =>
 
// );
app.listen(3001, () => {
  console.log("server running in http://localhost:3001");
})