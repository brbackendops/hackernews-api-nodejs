module.exports = class UserController {
    constructor(userServ) {
        this.userServ = userServ;
    }

    async registerController(req, res, next) {
        try {
            const payload = req.body;
            const user_json = await this.userServ.registerUser(payload);
            return res.status(201).json(user_json);
        } catch (error) {
            next(error);
        }
    }

    async loginController(req, res, next) {
        try {
            const payload = req.body;
            const user_json = await this.userServ.loginUser(payload, req);
            return res.status(200).json(user_json);
        } catch (error) {
            next(error);
        }
    }

    async logoutController(req, res, next) {
        try {
            req.session.destroy(() => {
                return res.status(200).json({
                    status: 'success',
                    message: 'user logged out successfully',
                });
            });
        } catch (error) {
            next(error);
        }
    }

    async updateController(req, res, next) {
        try {
            const payload = req.body;
            const email = req.session.user.email;
            let msg = await this.userServ.updateUser(email, payload);
            return res.status(200).json({
                status: 'success',
                message: msg,
            });
        } catch (error) {
            next(error);
        }
    }
};
