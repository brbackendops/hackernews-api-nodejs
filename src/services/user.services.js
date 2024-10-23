const HTTPException = require('../exceptions/httpE');

module.exports = class UserServices {
    constructor(userRepo, hash) {
        this.repo = userRepo;
        this.hash = hash;
    }

    async registerUser(payload) {
        try {
            payload.password = this.hash.hashSync(payload.password, 10);
            let user = await this.repo.createUser(payload);
            return {
                status: 'success',
                data: user,
            };
        } catch (error) {
            throw error;
        }
    }

    async loginUser(payload, req) {
        try {
            const user = await this.repo.getUser(payload.email);
            const passwordMatch = this.hash.compareSync(
                payload.password,
                user[0].password
            );
            if (!passwordMatch) {
                throw new HTTPException(400, 'password does not match');
            }

            const { id, username, password, email } = user[0];
            const user_data = {
                id,
                username,
                password,
                email,
            };
            req.session.user = user_data;
            return {
                status: 'success',
                message: 'logged in successfully',
            };
        } catch (error) {
            throw error;
        }
    }

    async updateUser(email, payload) {
        try {
            let msg = await this.repo.updateUser(email, payload);
            return msg;
        } catch (error) {
            throw error;
        }
    }
};
