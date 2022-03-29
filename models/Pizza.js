const mongoose = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// Schema
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
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => dateFormat(date),
    },
    // The pizza's suggested size
    size: {
      type: String,
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
      default: 'Large',
      validate: {
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
  return this.comments.reduce(
    (total, comment) => total + comment.replies.length + 1,
    0
  );
});

// Model
const Pizza = mongoose.model('Pizza', pizzaSchema);

// Exporting the pizza model
module.exports = Pizza;
