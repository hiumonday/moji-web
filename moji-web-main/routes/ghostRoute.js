const express = require('express');
const router = express.Router();
const postsController = require('../controllers/ghostController');

// Define the route for browsing posts
router.get('/posts', postsController.browsePosts);

// Define the route for reading a single post
router.get('/posts/:slug', postsController.readPost);

// Define the route for browsing tags
router.get('/tags', postsController.browseTags);

// Define the route for browsing authors
router.get('/authors', postsController.browseAuthors);

// Define the route for browsing posts by a specific tag
router.get('/tags/:tag/posts', postsController.browsePostsByTag);

router.get('/authors/:author/posts', postsController.browsePostsByAuthor);

router.get('/featured', postsController.browseFeatured);



module.exports = router;