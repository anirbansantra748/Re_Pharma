const Post = require('../models/postSchema');
const Comment = require('../models/postComment');
const wrapAsync = require('../middleware/wrapAsync')
// Create Post
module.exports.renderCreatePost = async (req,res) => {
    res.render('pages/createBlog.ejs');
}
module.exports.createPost = wrapAsync(async (req, res) => {
    try {
        const { title, content } = req.body;
        const newPost = new Post({ title, content });
        await newPost.save();
        res.redirect('/blogs/');
    } catch (err) {
        res.status(500).send('Error creating post: ' + err.message);
    }
})

// Get All Posts
module.exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate('comments');
        let trendingPosts = Post.find().sort({ likes: -1 }).limit(4);
        res.render('pages/blog.ejs', { posts,trendingPosts });
    } catch (err) {
        res.status(500).send('Error fetching posts');
    }
};

// Get Single Post
module.exports.getPost = wrapAsync(async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('comments');
        if (!post) return res.status(404).send('Post not found');
        res.render('pages/showBlogs.ejs', { post });
    } catch (err) {
        res.status(500).send('Error fetching post');
    }
})

// Update Post
module.exports.renderEditPost = async (req, res) => {
    let post = await Post.findById(req.params.id);
    res.render('pages/editBlog.ejs',{post})
}

module.exports.updatePost = wrapAsync(async (req, res) => {
    try {
        const { title, content } = req.body;
        await Post.findByIdAndUpdate(req.params.id, { title, content });
        res.redirect(`/blogs/${req.params.id}`);
    } catch (err) {
        res.status(500).send('Error updating post');
    }
})

// Delete Post
module.exports.deletePost = wrapAsync(async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.redirect('/blogs/');
    } catch (err) {
        res.status(500).send('Error deleting post');
    }
})

// Like Post
module.exports.likePost = async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } });
        res.redirect(`/blogs/${req.params.id}`);
    } catch (err) {
        res.status(500).send('Error liking post');
    }
};

module.exports.dislikePost = async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, { $inc: { dislikes: 1 } });
        res.redirect(`/blogs/${req.params.id}`);
    } catch (err) {
        res.status(500).send('Error liking post');
    }
};
