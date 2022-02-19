const router = require('express').Router();
const {
  findComments,
  addComment,
  addReply,
  removeComment,
  removeReply,
} = require('../../controllers/comment-controller');

// /api/comments
router.route('/', findComments);

// /api/comments/<pizzaId>
router.route('/:pizzaId').post(addComment);

// /api/comments/:pizzaId/:commentId
router.route('/:pizzaId/:commentId').put(addReply).delete(removeComment);

// /api/comments/:pizzaId/:commentId/:replyId
router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);

module.exports = router;
