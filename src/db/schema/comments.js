// const { pgTable } = require("drizzle-orm/pg-core");
const { relations } = require('drizzle-orm');
const {
    pgTable: table,
    integer,
    text,
    timestamp,
    serial,
} = require('drizzle-orm/pg-core');
const { usersTable } = require('./users');
const { postsTable } = require('./posts');
const timestamps = {
    created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
};

const commentsTable = table('comments', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(),
    postId: integer('post_id').notNull(),
    parentCommentId: integer('parent_comment_id'),
    content: text('content').notNull(),
    depth: integer('depth').default(0).notNull(),
    commentCount: integer('comment_count').default(0).notNull(),
    points: integer('points').default(0).notNull(),
    ...timestamps,
});

const commentsUpVotesTbale = table('comments_upvotes', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(),
    commentId: integer('comment_id').notNull(),
    ...timestamp,
});

const commentRelations = relations(
    commentsTable,
    ({ one, many }) => ({
        author: one(usersTable, {
            fields: [commentsTable.userId],
            references: [usersTable.id],
            relationName: 'author',
        }),

        parentComment: one(commentsTable, {
            fields: [commentsTable.parentCommentId],
            references: [commentsTable.id],
            relationName: 'childComments',
        }),

        childComment: many(commentsTable, {
            relationName: 'childComments',
        }),

        post: one(postsTable, {
            fields: [commentsTable.postId],
            references: [postsTable.id],
            relationName: 'postComments',
        }),

        commentUpVotes: many(commentsUpVotesTbale),
    }),
    { onDelete: 'cascade' }
);

const commentUpVotesRelation = relations(
    commentsUpVotesTbale,
    ({ one }) => ({
        comment: one(commentsTable, {
            fields: [commentsUpVotesTbale.commentId],
            references: [commentsTable.id],
            relationName: 'commentUpVotes',
        }),
    }),
    { onDelete: 'cascade' }
);

module.exports = {
    commentsTable,
    commentsUpVotesTbale,
    commentRelations,
    commentUpVotesRelation,
};
