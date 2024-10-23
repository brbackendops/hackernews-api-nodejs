const router = require('express').Router();

const CommentRepo = require('../db/repository/comment.repo');
const CommentServ = require('../services/comment.services');
const CommentCont = require('../controllers/comment.cont');

const commentServ = new CommentServ(CommentRepo);
const commCont = new CommentCont(commentServ);

const { authMiddleware } = require('../middlewares/auth/auth');
const transformReq = require('../middlewares/parse/zod_parse');
const { createCommentSchema } = require('../shared/comment.shared');

router
    .route('/:postId/comment')
    .post(
        authMiddleware,
        transformReq(createCommentSchema),
        commCont.commentCreateCont.bind(commCont)
    );

router
    .route('/:postId')
    .get(authMiddleware, commCont.commentRetreiveCont.bind(commCont));

module.exports = router;
