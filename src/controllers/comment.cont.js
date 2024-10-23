const { createCommentSchema } = require('../shared/comment.shared');

module.exports = class CommentsController {
    constructor(commentServ) {
        this.serv = commentServ;
    }

    async commentCreateCont(req, res, next) {
        try {
            const payload = req.body;
            const postId = req.params.postId;
            payload.userId = req.session.user.id;
            payload.postId = postId;
            const comment = await this.serv.createCommentServ(payload);

            return res.status(201).json({
                status: 'success',
                data: comment,
            });
        } catch (error) {
            next(error);
        }
    }

    async commentRetreiveCont(req, res, next) {
        try {
            const postId = req.params.postId;
            const payload = createCommentSchema.parse(req.query);
            const user = req.session.user;
            const comments = await this.serv.retreiveCommentsServc(
                postId,
                user,
                payload
            );

            return res.status(201).json({
                status: 'success',
                data: comments,
            });
        } catch (error) {
            next(error);
        }
    }
};
