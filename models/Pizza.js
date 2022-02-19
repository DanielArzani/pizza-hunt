// We could import the entire mongoose library, but we only need to worry about the Schema constructor and model function, so we'll just import them
// const { Schema, model } = require('mongoose')
// Not sure if the error (unique was working) was coming from above or because I hadn't dropped the database before trying again
const mongoose = require('mongoose');

// Schema
// We don't use mongoose.Schema because we directly imported the Schema
const pizzaSchema = new mongoose.Schema({
  // Name of the pizza
  pizzaName: {
    type: String,
    trim: true,
    required: [true, 'A pizza requires a name'],
    unique: true,
  },
  // The name of the user that created the pizza
  createdBy: {
    type: String,
    required: [true, 'A user requires a name'],
  },
  // A timestamp of when the pizza was created
  // Will automatically be converted to "2022-02-19T04:44:42.893Z" format
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
    enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
    validate: {
      // This function gets access to what was inputted (val) and the document (using the "this" keyword)
      // The "this" keyword will only apply to documents that are just created, not updated!
      validator: function (val) {
        const acceptedSizes = [
          'Personal',
          'Small',
          'Medium',
          'Large',
          'Extra Large',
        ];

        acceptedSizes.forEach((el) => {
          if (val === el) {
            return true;
          }
          return false;
        });
      },
      message:
        'Size of pizza must be one of these options: 1) Personal 2) Small, 3) Medium, 4) Large, 5) Extra Large ',
    },
  },
  // The pizza's toppings
  toppings: {
    type: Array,
    // enum: [],
  },
});

// Model
// We don't use mongoose.model because we directly imported the model
const Pizza = mongoose.model('Pizza', pizzaSchema);

// Exporting the pizza model
module.exports = Pizza;
