const Post = require('../models/postSchema');
const Comment = require('../models/postComment');

// Add Comment
module.exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send('Post not found');

        const newComment = new Comment({ text, postId: req.params.id });
        await newComment.save();

        post.comments.push(newComment);
        await post.save();

        res.redirect(`/blogs/${req.params.id}`);
    } catch (err) {
        res.status(500).send('Error adding comment');
    }
};

// Delete Comment
module.exports.deleteComment = async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.commentId);
        await Post.findByIdAndUpdate(req.params.postId, { $pull: { comments: req.params.commentId } });

        res.redirect(`/blogs/${req.params.postId}`);
    } catch (err) {
        res.status(500).send('Error deleting comment');
    }
};
