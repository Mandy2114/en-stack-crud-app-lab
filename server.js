const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require('mongoose')
const methodOverride = require("method-override");
const morgan = require("morgan");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new

const Dog = require("./models/dog.js");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get("/dogs/new", (req, res) => {
  res.render("dogs/new.ejs");
  // res.send("This route sends the user a form page!");
});

app.post("/dogs", async (req, res) => {
  if (req.body.isReadyToAdopt === "on") {
    req.body.isReadyToAdopt = true;
  } else {
    req.body.isReadyToAdopt = false;
  }

  await Dog.create(req.body);

  res.redirect("/dogs");
});

app.get("/dogs", async (req, res) => {
  const allDogs = await Dog.find();
  res.render("dogs/index.ejs", { dogs: allDogs });
});

app.get("/dogs/:dogId", async (req, res) => {
  const foundDog = await Dog.findById(req.params.dogId);
  res.render("dogs/show.ejs", { dog: foundDog });
});

app.delete("/dogs/:dogId", async (req, res) => {
  await Dog.findByIdAndDelete(req.params.dogId);
  res.redirect("/dogs");
});

app.get("/dogs/:dogId/edit", async (req, res) => {
  const foundDog = await Dog.findById(req.params.dogId);
  res.render("dogs/edit.ejs", {
    fruit: foundDog,
  });
});

app.put("/dogs/:dogId", async (req, res) => {
  // Handle the 'isReadyToEat' checkbox data
  if (req.body.isReadyToAdopt === "on") {
    req.body.isReadyToAdopt = true;
  } else {
    req.body.isReadyToAdopt = false;
  }
  
  // Update the fruit in the database
  await Dog.findByIdAndUpdate(req.params.dogId, req.body);

  // Redirect to the fruit's show page to see the updates
  res.redirect(`/dogs/${req.params.dogId}`);
});


app.listen(3000, () => 
console.log("Listening on port 3000"))

