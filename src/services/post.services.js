const { paginationSchema } = require('../shared/pagination.shared');

module.exports = class PostServices {
    constructor(postRepo) {
        this.repo = postRepo;
    }

    async postLatest(req) {
        try {
            const reqQuery = paginationSchema.parse(req.query);

            const posts = await this.repo.postList(req.session.user, reqQuery);
            return posts;
        } catch (error) {
            throw error;
        }
    }

    async postRetrieve(id) {
        try {
            const post = await this.repo.getPost(id);
            return {
                status: 'success',
                data: post,
            };
        } catch (error) {
            throw error;
        }
    }

    async postCreation(payload, user_id) {
        try {
            payload.userId = user_id;
            const post = await this.repo.createPost(payload);
            return {
                status: 'success',
                data: post,
            };
        } catch (error) {
            throw error;
        }
    }

    async postUpdation(id, payload, userId) {
        try {
            let msg = await this.repo.updatePost(id, payload, userId);
            return {
                status: 'success',
                message: msg,
            };
        } catch (error) {
            throw error;
        }
    }

    async postDeletion(id) {
        try {
            let msg = await this.repo.deletePost(id);
            return {
                status: 'success',
                message: msg,
            };
        } catch (error) {
            throw error;
        }
    }

    async postUpVoteServ(postId, userId) {
        try {
            let vote = await this.repo.createUpVote(postId, userId);
            return vote;
        } catch (error) {
            throw error;
        }
    }
};
