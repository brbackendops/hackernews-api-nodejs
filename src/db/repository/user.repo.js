const { eq, desc } = require('drizzle-orm');
const { usersTable } = require('../schema/users');
const db = require('../setup');
const HttpException = require('../../exceptions/httpE');

class UserRepository {
    constructor() {}

    async createUser(payload) {
        try {
            const user = await db.insert(usersTable).values(payload).returning({
                username: usersTable.username,
                email: usersTable.email,
                location: usersTable.location,
            });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUser(email) {
        try {
            const user = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.email, email));
            if (user === null) {
                throw new HttpException(400, 'user does not exists');
            }

            return user;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(email, payload) {
        try {
            const user = await this.getUser(email);
            if (!user) {
                throw new HttpException(400, 'user not found');
            }
            await db
                .update(usersTable)
                .set(payload)
                .where(eq(usersTable.email, email));
            return 'user updated successfully';
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(email) {
        try {
            await db.delete(usersTable).where(eq(usersTable.email), email);
            return 'user deleted successfully';
        } catch (error) {
            throw error;
        }
    }

    async listUsers() {
        try {
            const users = await db
                .select()
                .from(usersTable)
                .orderBy(desc(usersTable.created_at));
            return users;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserRepository();
