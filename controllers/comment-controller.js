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

  /**----------------------------
   *    Add Reply to Comment
   *---------------------------**/
  addReply({ params, body }, res) {
    // Find comment first and update to include replies
    Comment.findByIdAndUpdate(
      params.commentId,
      // Push into array what ever is in the req.body that matches the model criteria
      { $push: { replies: body } },
      { new: true }
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
  /**----------------------------------------------------------------------------------
   *   WHY DO I HAVE TO PUSH THE UPDATE INTO REPLIES?
   *@question What I want: Comment.findByIdAndUpdate(params.id, body, { new: true })
   *@answer This is an array, if I replace the whole document using PUT then I will lose everything else in the array and if I replace a portion of it using PATCH then I will still lose the other elements in the array, we don't know or want to know what else is in there, just what to put in or take out data
   @answer When we store something in such a way that it is referencing or embedding another model then what will be stored in that array is simple an ObjectId(see mongoCompass), removing or adding ids to the array is how to add or remove values from it
   *---------------------------------------------------------------------------------**/
  /*--------------- END OF QUESTIONS --------------*/

  /**----------------------------
   *    Remove Reply to Comment
   *---------------------------**/
  removeReply({ params }, res) {
    Comment.findByIdAndUpdate(
      params.commentId,
      // Pull out of the replies array the document with the matching id
      // Inside the array, they are stored using ObjectId's, remove that id and you remove the entire document
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
   *@answer If I simply do this, it won't actually delete the comment from the Pizza document
   *@answer We also don't want the comment to still exist after its been pulled from the array, so we have to delete it as well
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
