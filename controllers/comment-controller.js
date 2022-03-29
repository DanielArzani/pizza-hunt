const { Comment, Pizza } = require('../models');

const commentController = {
  /**----------------------------
   *    Add Comment to Pizza
   *---------------------------**/
  addComment({ params, body }, res) {
    Comment.create(body)
      .then(({ _id }) =>
        Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $push: { comments: _id } },
          { new: true }
        )
      )
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },

  /**----------------------------
   *    Add Reply to Comment
   *---------------------------**/
  addReply({ params, body }, res) {
    Comment.findByIdAndUpdate(
      params.commentId,
      { $push: { replies: body } },
      { new: true, runValidators: true }
    )
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }

        res.status(200).json(dbPizzaData);
      })
      .catch((err) => res.status(500).json(err));
  },

  /**----------------------------
   *    Remove Reply to Comment
   *---------------------------**/
  removeReply({ params }, res) {
    Comment.findByIdAndUpdate(
      params.commentId,
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
    )
      .then((dbPizzaData) => {
        res.status(204).json(dbPizzaData);
      })
      .catch((err) => res.status(500).json(err));
  },
  /**----------------------
   *    Remove Comment
   *---------------------**/
  removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then((deletedComment) => {
        if (!deletedComment) {
          return res.status(404).json({ message: 'No comment with this id!' });
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } },
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = commentController;
