const { Comment, Pizza } = require('../models');

const commentController = {
  /**----------------------------
   *    Add Comment to Pizza
   *---------------------------**/
  // /api/comments/:pizzaId
  // {
  //    writtenBy: ""
  //    commentBody: ""
  // }
  addComment({ params, body }, res) {
    // Create comment
    Comment.create(body)
      // Take comment id out
      .then(({ _id }) =>
        // Update pizza document
        Pizza.findOneAndUpdate(
          // Find pizza based on the params
          { _id: params.pizzaId },
          // Push the newly created comment document into comments field which we found by using its id
          // {field we want to push into, what we want to push}
          { $push: { comments: _id } },
          // Return updated document
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

  /**----------------------
   *    Remove Comment
   *---------------------**/
  removeComment({ params }, res) {
    // Get the comment by its id and delete it
    Comment.findOneAndDelete({ _id: params.commentId })
      .then((deletedComment) => {
        if (!deletedComment) {
          return res.status(404).json({ message: 'No comment with this id!' });
        }
        return Pizza.findOneAndUpdate(
          // What we are updating
          { _id: params.pizzaId },
          // The fields we are updating and with what are they being updated with
          // In this case, we are pulling a comment out
          { $pull: { comments: params.commentId } },
          // Return updated object
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
  /**==================================================================
   *   WHY DO I NEED TO UPDATE THE PIZZA MODEL AFTERWARDS?
   *@comment If I simply do this, it won't actually delete the comment from the Pizza document
   *@comment We also don't want the comment to still exist after its been pulled from the array, so we have to delete it as well
   *===================================================================**/
  // removeComment(req, res) {
  //   Comment.findByIdAndDelete(req.params.commentId).then((deletedComment) => {
  //     res.status(204).json({
  //       status: 'success',
  //       data: {
  //         deletedComment,
  //       },
  //     });
  //   });
  // },
  /*--------------- END OF QUESTIONS --------------*/
};

module.exports = commentController;
