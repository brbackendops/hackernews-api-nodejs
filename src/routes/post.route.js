const { authMiddleware } = require('../middlewares/auth/auth');
const router = require('express').Router();

const postService = require('../services/post.services');
const PostController = require('../controllers/posts.cont');

const postRepo = require('../db/repository/posts.repo');
const postServ = new postService(postRepo);
const postCont = new PostController(postServ);

router.route('/').get(authMiddleware, postCont.postListCont.bind(postCont));
router
    .route('/:postId')
    .get(authMiddleware, postCont.postSingleCont.bind(postCont));
router.route('/').post(authMiddleware, postCont.postCreateCont.bind(postCont));
router
    .route('/:postId')
    .put(authMiddleware, postCont.postUpdateCont.bind(postCont));
router
    .route('/:postId')
    .delete(authMiddleware, postCont.postDeleteCont.bind(postCont));

router
    .route('/:postId/vote')
    .post(authMiddleware, postCont.postVoteCont.bind(postCont));

module.exports = router;
