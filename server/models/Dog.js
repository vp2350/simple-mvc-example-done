// require mongoose, a popular MongoDB library for nodejs
const mongoose = require('mongoose');

// variable to hold our Model
let DogModel = {};

// A DB Schema to define our data structure
const DogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  breed: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },
    
  createdDate: {
    type: Number,
    required: true,
  },

});

// Schema.statics are static methods attached to the Model or objects
DogSchema.statics.findByName = (name, callback) => {
  const search = {
    name,
  };

  return DogModel.findOne(search, callback);
};

// Create the dog model based on the schema. You provide it with a custom discriminator
DogModel = mongoose.model('Dog', DogSchema);


// export our public properties
module.exports.DogModel = DogModel;
module.exports.DogSchema = DogSchema;