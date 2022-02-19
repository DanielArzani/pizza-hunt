const mongoose = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const replySchema = new mongoose.Schema(
  {
    // set custom id to avoid confusion with parent comment _id
    replyId: {
      type: mongoose.Schema.Types.ObjectId,
      // Will generate a new ObjectId
      default: new mongoose.Types.ObjectId(),
    },
    replyBody: {
      type: String,
    },
    writtenBy: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
  },
  {
    toJSON: { getters: true },
  }
);

const commentSchema = new mongoose.Schema(
  {
    writtenBy: {
      type: String,
    },
    commentBody: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    // Unlike in Pizza.js, replies are directly nested within the comment and not referred too
    replies: [replySchema],
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
commentSchema.virtual('replyCount').get(function () {
  return this.replies.length;
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
