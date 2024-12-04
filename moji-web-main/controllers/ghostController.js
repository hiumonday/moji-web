// controllers/postsController.js
const api = require('../config/ghost');

// Fetch all posts
exports.browsePosts = (req, res) => {
    api.posts.browse({fields: 'title, slug, reading_time, feature_image, published_at, excerpt, reading_time', include: 'authors,tags'})
    .then((posts) => {
        res.status(200).json({ success: true, data: posts });
    })
    .catch((err) => {
        res.status(500).json({ success: false, error: err.message });
    });
};

// Fetch a single post
exports.readPost = (req, res) => {
    api.posts.read({slug: req.params.slug, include: 'authors,tags'})
    .then((post) => {
        res.status(200).json({ success: true, data: post });
    })
    .catch((err) => {
        res.status(500).json({ success: false, error: err.message });
    });
};

// Fetch all tags
exports.browseTags = (req, res) => {
    api.tags.browse()
    .then((tags) => {
        res.status(200).json({ success: true, data: tags });
    })
    .catch((err) => {
        res.status(500).json({ success: false, error: err.message });
    });
};

// Fetch all authors
exports.browseAuthors = (req, res) => {
    api.authors.browse()
    .then((authors) => {
        res.status(200).json({ success: true, data: authors });
    })
    .catch((err) => {
        res.status(500).json({ success: false, error: err.message });
    });
};

// Fetch posts by a specific tag
exports.browsePostsByTag = (req, res) => {
    api.posts.browse({filter: `tags:${req.params.tag}`, include: 'authors,tags'})
    
    .then((posts) => {
        res.status(200).json({ success: true, data: posts });
    })
    .catch((err) => {
        res.status(500).json({ success: false, error: err.message });
    });
};

exports.browsePostsByAuthor = (req, res) => {
    api.posts.browse({filter: `authors:${req.params.author}`, include: 'authors,tags'})
    
    .then((posts) => {
        res.status(200).json({ success: true, data: posts });
    })
    .catch((err) => {
        res.status(500).json({ success: false, error: err.message });
    });
};

exports.browseFeatured = (req, res) => {

    api.posts.browse({limit: 5, filter: 'featured:true', fields: 'title, slug'})
    .then((posts) => {
        console.log(posts)
        res.status(200).json({ success: true, data: posts });
    })
    .catch((err) => {
        res.status(500).json({ success: false, error: err.message });
    });
};