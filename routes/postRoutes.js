const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.get('/new', postController.renderCreatePost);
router.post('/new', postController.createPost);
router.get('/:id', postController.getPost);
router.get('/:id/edit', postController.renderEditPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.post('/:id/like', postController.likePost);
router.post("/:id/dislike", postController.dislikePost);

module.exports = router;
