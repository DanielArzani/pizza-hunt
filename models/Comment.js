const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  writtenBy: {
    type: String,
  },
  commentBody: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
