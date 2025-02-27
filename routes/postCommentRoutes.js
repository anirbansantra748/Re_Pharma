const express = require('express');
const router = express.Router();
const commentController = require('../controllers/postCommentController');

router.post('/:id/comment', commentController.addComment);
router.delete('/:postId/comment/:commentId', commentController.deleteComment);

module.exports = router;
