module.exports = class PostController {
    constructor(postServ) {
        this.postServ = postServ;
    }

    async postSingleCont(req, res, next) {
        try {
            const id = parseInt(req.params.postId);
            console.log(id);
            const post_json = await this.postServ.postRetrieve(id);
            return res.status(200).json(post_json);
        } catch (error) {
            next(error);
        }
    }

    async postListCont(req, res, next) {
        try {
            const posts_json = await this.postServ.postLatest(req);
            res.status(200).json(posts_json);
        } catch (error) {
            next(error);
        }
    }

    async postCreateCont(req, res, next) {
        try {
            const payload = req.body;
            const post_json = await this.postServ.postCreation(
                payload,
                req.session.user.id
            );

            return res.status(201).json(post_json);
        } catch (error) {
            next(error);
        }
    }

    async postUpdateCont(req, res, next) {
        try {
            const payload = req.body;
            const id = parseInt(req.params.postId);
            const post_json = await this.postServ.postUpdation(
                id,
                payload,
                req.session.user.id
            );
            return res.status(201).json(post_json);
        } catch (error) {
            next(error);
        }
    }

    async postDeleteCont(req, res, next) {
        try {
            const id = parseInt(req.params.postId);
            console.log(id);
            let post_json = await this.postServ.postDeletion(id);
            return res.status(201).json(post_json);
        } catch (error) {
            next(error);
        }
    }

    async postVoteCont(req, res, next) {
        try {
            const postId = req.params.postId;
            const userId = req.session.user.id;
            let vote_data = await this.postServ.postUpVoteServ(postId, userId);
            return res.status(200).json({
                status: 'success',
                data: vote_data,
            });
        } catch (error) {
            next(error);
        }
    }
};
