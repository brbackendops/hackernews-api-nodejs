const db = require('../setup');
const { commentsTable, commentsUpVotesTbale } = require('../schema/comments');
const { postsTable } = require('../schema/posts');
const HTTPException = require('../../exceptions/httpE');
const {
    eq,
    desc,
    asc,
    and,
    countDistinct,
    sql,
    isNull,
} = require('drizzle-orm');
const { usersTable } = require('../schema/users');

class CommentRepository {
    constructor() {}

    async CommentCreate(payload) {
        try {
            const [updated] = await db
                .update(postsTable)
                .set({
                    commentCount: sql`${postsTable.commentCount} + 1`,
                })
                .returning({ commentCount: postsTable.commentCount });

            if (!updated) {
                throw new HTTPException(400, 'post not found');
            }

            const comment = await db
                .insert(commentsTable)
                .values(payload)
                .returning({
                    userId: commentsTable.userId,
                    postId: commentsTable.postId,
                    parentCommentId: commentsTable.parentCommentId,
                    content: commentsTable.content,
                    depth: commentsTable.depth,
                    commentCount: commentsTable.commentCount,
                    points: commentsTable.points,
                });

            return comment;
        } catch (error) {
            throw error;
        }
    }

    async CommentChildCreate(payload) {
        try {
        } catch (error) {
            throw error;
        }
    }

    async CommentDelete(postId, userId) {
        try {
            await db
                .delete(commentsTable)
                .where(
                    and(
                        eq(commentsTable.postId, postId),
                        eq(commentsTable.userId, userId)
                    )
                );

            return 'post deleted successfully';
        } catch (error) {
            throw error;
        }
    }

    async CommentRetrieve(
        postId,
        user,
        { limit, page, sortBy, orderBy, author, site }
    ) {
        try {
            let offset = (page - 1) * limit;
            let sortByCol =
                sortBy === 'points'
                    ? commentsTable.points
                    : commentsTable.created_at;
            let orderByCol =
                orderBy === 'desc' ? desc(sortByCol) : asc(sortByCol);

            const comments = db
                .select({
                    id: commentsTable.id,
                    postId: commentsTable.postId,
                    author: {
                        id: usersTable.id,
                        username: usersTable.username,
                    },
                    isVoted: user
                        ? sql`CASE WHEN ${commentsUpVotesTbale.userId} IS NOT NULL THEN true ELSE false END`
                        : false,
                })
                .from(commentsTable)
                .where(
                    and(
                        eq(commentsTable.postId, postId),
                        isNull(commentsTable.parentCommentId)
                    )
                )
                .leftJoin(usersTable)
                .offset(offset)
                .limit(limit)
                .orderBy(orderByCol);

            if (user) {
                db.leftjoin(
                    commentsUpVotesTbale,
                    and(
                        eq(commentsUpVotesTbale.postId, postId),
                        eq(commentsUpVotesTbale.userId, user.id)
                    )
                );
            }

            let data = await comments;
            return data;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CommentRepository();
