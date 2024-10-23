const {
    pgTable: table,
    integer,
    timestamp,
    varchar,
    text,
    serial,
} = require('drizzle-orm/pg-core');
const { usersTable } = require('./users');
const { commentsTable } = require('./comments');
const { relations } = require('drizzle-orm');

const timestamps = {
    created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
};

const postsTable = table('posts', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 600 }).notNull(),
    content: text('content'),
    userId: integer('user_id').notNull(),
    url: text('url'),
    points: integer('points').default(0).notNull(),
    commentCount: integer('comment_count').default(0).notNull(),
    ...timestamps,
});

const postsUpVotesTable = table('posts_upvotes', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(),
    postId: integer('post_id').notNull(),
    created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

const postsRelation = relations(
    postsTable,
    ({ one, many }) => ({
        author: one(usersTable, {
            fields: [postsTable.userId],
            references: [usersTable.id],
            relationName: 'author',
        }),

        comments: many(commentsTable),

        postsUpVotes: many(postsUpVotesTable),
    }),
    { onDelete: 'cascade' }
);

const postsUpVotesRelation = relations(
    postsUpVotesTable,
    ({ one }) => ({
        post: one(postsTable, {
            fields: [postsUpVotesTable.postId],
            references: [postsTable.id],
            relationName: 'postUpVotes',
        }),
    }),
    { onDelete: 'cascade' }
);

module.exports = {
    postsTable,
    postsUpVotesTable,
    postsRelation,
    postsUpVotesRelation,
};
