// We could import the entire mongoose library, but we only need to worry about the Schema constructor and model function, so we'll just import them
// const { Schema, model } = require('mongoose')
// Not sure if the error (unique was working) was coming from above or because I hadn't dropped the database before trying again
const mongoose = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// Schema
// We don't use mongoose.Schema because we directly imported the Schema
const pizzaSchema = new mongoose.Schema(
  {
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
      trim: true,
      required: [true, 'A user requires a name'],
    },
    // A timestamp of when the pizza was created
    // Will automatically be converted to "2022-02-19T04:44:42.893Z" format
    // This format won't be saved in the database, it is just modifying it when we try to get this data in JSON format
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => dateFormat(date),
    },
    // A timestamp of any updates to the pizza's data
    //   updatedAt: {
    //     type: Date,
    //   },
    // The pizza's suggested size
    size: {
      type: String,
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
      default: 'Large',
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
    },
    // Embedded Referencing
    comments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  //Options Object
  {
    // When the data is outputted as JSON or as an object, we want our virtual properties to show
    // We also want our getters to show
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true },
    // We set id to false because this is a virtual that Mongoose returns, and we don’t need it
    id: false,
  }
);

/**---------------
 *   VIRTUALS
 *--------------**/

// Get the number of comments a pizza has
pizzaSchema.virtual('commentCount').get(function () {
  // return this.comments.length;

  //Here we're using the .reduce() method to tally up the total of every comment with its replies. In its basic form, .reduce() takes two parameters, an accumulator and a currentValue. Here, the accumulator is total, and the currentValue is comment. As .reduce() walks through the array, it passes the accumulating total and the current value of comment into the function, with the return of the function revising the total for the next iteration through the array.
  return this.comments.reduce(
    (total, comment) => total + comment.replies.length + 1,
    0
  );
});

// Model
// We don't use mongoose.model because we directly imported the model
const Pizza = mongoose.model('Pizza', pizzaSchema);

// Exporting the pizza model
module.exports = Pizza;
