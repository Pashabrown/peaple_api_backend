///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// first thing is get .env variables
require("dotenv").config();
// pull the PORT variables from .env, give default value of 3000
//
const { PORT = 3000, MONGODB_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");

//import middleware 
const cors = require("cors");
const morgan = require("morgan");

///////////////////////////////
// MODELS
////////////////////////////////
//this describes an individual unit of our people schema
const PeopleSchema = new mongoose.Schema({
  name: String,
  image: String,
  title: String,
});


const People = mongoose.model("People", PeopleSchema);

///////////////////////////////
// MiddleWare
////////////////////////////////
//middleware is before routes because you want your server to have all the tools to run before it looks for routes
////////////////////////////////

//passing a plain vanilla cors request - cors is another level of security
//cors allows all the traffic 

app.use(cors()); // to prevent cors errors, open access to all origins
//
app.use(morgan("dev")); // logging
//this tells the computer this is json data so let me parse that and put it in req.body
app.use(express.json()); // parse json bodies

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
// 3 Connection Events
mongoose.connection
  .on("open", () => console.log("Your are connected to mongoose"))
  .on("close", () => console.log("Your are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

///////////////////////////////
// ROUTES
////////////////////////////////
// create a TEST ROUTE
app.get("/", (req, res) => {
  res.send("hello world");
});

// PEOPLE INDEX ROUTE try catch says if something goes wrong the catch will put it in a 400 error
app.get("/people", async (req, res) => {
  try {
    // send all people- this is a request to the mongo data base
    //from the people collection in my database find me all the people 
    res.json(await People.find({}));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// PEOPLE CREATE ROUTE
app.post("/people", async (req, res) => {
  try {
    // send all people to the function to create a new person
    //and then returns that new person as json data
    res.json(await People.create(req.body));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

//PEOPLE UPDATE ROUTE "put" or "patch" updat emodel always used the name of the model 
//and the params that ae the variable that are stored in the ID of params
app.put("/people/:id", async (req, res) => {
    try {
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error){
        res.status(400).json(error)
    }
})

//PEOPLE DELETE ROUTE 
app.delete("/people/:id", async (req, res) => {
    try {
        res.json(await People.findByIdAndRemove(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
});
///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));