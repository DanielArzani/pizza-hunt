const router = require('express').Router();
const {
  findComments,
  addComment,
  removeComment,
} = require('../../controllers/comment-controller');

// /api/comments
router.route('/', findComments);

// /api/comments/<pizzaId>
router.route('/:pizzaId').post(addComment);

// /api/comments/<pizzaId>/<commentId>
router.route('/:pizzaId/:commentId').delete(removeComment);

module.exports = router;
