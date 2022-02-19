// We could import the entire mongoose library, but we only need to worry about the Schema constructor and model function, so we'll just import them
const { Schema, model } = require('mongoose');

// Schema
// We don't use mongoose.Schema because we directly imported the Schema
const pizzaSchema = new Schema({
  // Name of the pizza
  pizzaName: {
    type: String,
    required: [true, 'A pizza requires a name'],
  },
  // The name of the user that created the pizza
  createdBy: {
    type: String,
    required: [true, 'A user requires a name'],
  },
  // A timestamp of when the pizza was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // A timestamp of any updates to the pizza's data
  //   updatedAt: {
  //     type: Date,
  //   },
  // The pizza's suggested size
  size: {
    type: String,
    enum: ['small', 'medium', 'large', 'extra-large'],
  },
  // The pizza's toppings
  toppings: {
    type: Array,
    // enum: [],
  },
});

// Model
// We don't use mongoose.model because we directly imported the model
const Pizza = model('Pizza', pizzaSchema);

// Exporting the pizza model
module.exports = Pizza;
