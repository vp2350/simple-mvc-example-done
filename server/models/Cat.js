// require mongoose, a popular MongoDB library for nodejs
const mongoose = require('mongoose');

// variable to hold our Model
let CatModel = {};

// A DB Schema to define our data structure
const CatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  bedsOwned: {
    type: Number,
    min: 0,
    required: true,
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },

});

// Schema.statics are static methods attached to the Model or objects
CatSchema.statics.findByName = (name, callback) => {
  const search = {
    name,
  };

  return CatModel.findOne(search, callback);
};

// Create the cat model based on the schema. You provide it with a custom discriminator
CatModel = mongoose.model('Cat', CatSchema);


// export our public properties
module.exports.CatModel = CatModel;
module.exports.CatSchema = CatSchema;
