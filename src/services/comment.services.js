module.exports = class CommentService {
    constructor(commRepo) {
        this.repo = commRepo;
    }

    async retreiveCommentsServc(postId, user, payload) {
        try {
            const comments = await this.repo.CommentRetrieve(
                postId,
                user,
                payload
            );
            return comments;
        } catch (error) {
            throw error;
        }
    }

    async createCommentServ(payload) {
        try {
            const post = await this.repo.CommentCreate(payload);
            return post;
        } catch (error) {
            throw error;
        }
    }

    async deleteCommentServ(postId) {
        try {
        } catch (error) {
            throw error;
        }
    }
};
