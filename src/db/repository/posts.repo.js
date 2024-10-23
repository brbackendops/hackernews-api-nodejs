const db = require('../setup');
const { postsTable, postsUpVotesTable } = require('../schema/posts');
const { eq, desc, asc, and, countDistinct, sql } = require('drizzle-orm');
const HTTPException = require('../../exceptions/httpE');
const { usersTable } = require('../schema/users');

class PostRepository {
    constructor() {}

    async postList(user, { limit, page, sortBy, orderBy, author, site }) {
        try {
            const offset = (page - 1) * limit;
            const sortByColumn =
                sortBy === 'points' ? postsTable.points : postsTable.created_at;
            const orderBySpec =
                orderBy === 'desc' ? desc(sortByColumn) : asc(sortByColumn);

            const [count] = await db
                .select({ count: countDistinct(postsTable.id) })
                .from(postsTable)
                .where(
                    and(
                        author ? eq(postsTable.userId, author) : undefined,
                        site ? eq(postsTable.url, site) : undefined
                    )
                );

            const posts = db
                .select({
                    id: postsTable.id,
                    title: postsTable.title,
                    url: postsTable.url,
                    points: postsTable.points,
                    createdAt: postsTable.created_at,
                    commentCount: postsTable.commentCount,
                    author: {
                        username: usersTable.username,
                        id: usersTable.id,
                    },
                    isUpVoted: user
                        ? sql`CASE WHEN ${postsUpVotesTable.userId} IS NOT NULL THEN true ELSE false END`
                        : sql`false`,
                })
                .from(postsTable)
                .leftJoin(usersTable, eq(postsTable.userId, usersTable.id))
                .orderBy(orderBySpec)
                .offset(offset)
                .limit(limit)
                .where(
                    and(
                        author ? eq(postsTable.userId, author) : undefined,
                        site ? eq(postsTable.url, site) : undefined
                    )
                );

            if (user) {
                posts.leftJoin(
                    postsUpVotesTable,
                    and(
                        eq(postsUpVotesTable.postId, postsTable.id),
                        eq(postsUpVotesTable.userId, user.id)
                    )
                );
            }

            let data = await posts;

            return {
                data,
                status: 'success',
                message: 'posts fetched',
                pagination: {
                    page: page,
                    totalPages: Number(Math.ceil(count.count / limit)),
                },
            };
        } catch (error) {
            throw error;
        }
    }
    async createPost(payload) {
        try {
            const post = await db
                .insert(postsTable)
                .values(payload)
                .returning();
            return post;
        } catch (error) {
            throw error;
        }
    }

    async getPost(id) {
        try {
            const post = await db
                .select()
                .from(postsTable)
                .where(eq(postsTable.id, id));
            if (!post) {
                throw new HTTPException(400, 'post not found');
            }
            return post;
        } catch (error) {
            throw error;
        }
    }

    async updatePost(id, payload, userId) {
        try {
            const post = await this.getPost(id);
            if (post[0].userId !== userId) {
                throw new HTTPException(403, 'access denied');
            }
            if (!post) {
                throw new HTTPException(400, 'post not found');
            }
            await db
                .update(postsTable)
                .set(payload)
                .where(eq(postsTable.id, id));
            return 'post updated successfully';
        } catch (error) {
            throw error;
        }
    }

    async deletePost(id) {
        try {
            await db.delete(postsTable).where(eq(postsTable.id, id));
            return 'post deleted successfully';
        } catch (error) {
            throw error;
        }
    }

    async createUpVote(postId, userId) {
        try {
            let points;
            let post = await this.getPost(postId);
            if (!post) {
                throw new HTTPException(400, 'post not found');
            }
            const voteExists = await db
                .select()
                .from(postsUpVotesTable)
                .where(
                    and(
                        eq(postsUpVotesTable.postId, postId),
                        eq(postsUpVotesTable.userId, userId)
                    )
                )
                .limit(1);

            voteExists.length > 0 ? (points = -1) : (points = 1);

            await db
                .update(postsTable)
                .set({ points: post[0].points + points })
                .where(eq(postsTable.id, postId));

            if (voteExists.length > 0) {
                throw new HTTPException(
                    400,
                    'user already voted for this post'
                );
            }
            const upVote = await db
                .insert(postsUpVotesTable)
                .values({ postId, userId })
                .returning();
            return upVote;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PostRepository();
