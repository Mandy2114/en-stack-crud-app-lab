const { name } = require("ejs");
const mongoose = require("mongoose");

const dogSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isReadyToAdopt: {
    Boolean,
  },
});

const Dog = mongoose.model("Dog", dogSchema);

module.exports = Dog;
