const { relations } = require('drizzle-orm');
const {
    pgTable: table,
    varchar,
    text,
    integer,
    timestamp,
    serial,
    uniqueIndex,
} = require('drizzle-orm/pg-core');
const { postsTable, postsUpVotesTable } = require('./posts');
const { commentsTable, commentsUpVotesTbale } = require('./comments');

const timestamps = {
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
};

const usersTable = table(
    'users',
    {
        id: serial('id').primaryKey(),
        username: varchar('username', { length: 256 }).notNull(),
        password: text('password').notNull(),
        location: varchar('location', { length: 100 }),
        email: varchar('email', { length: 500 }).notNull().unique(),
        ...timestamps,
    },
    (table) => {
        return {
            emailIndex: uniqueIndex('emailIndex').on(table.email),
        };
    }
);

const userRelations = relations(
    usersTable,
    ({ many }) => ({
        posts: many(postsTable, {
            relationName: 'author',
        }),
        comments: many(commentsTable, {
            relationName: 'author',
        }),
        postUpVotes: many(postsUpVotesTable, {
            relationName: 'postUpVotes',
        }),
        commentUpVotes: many(commentsUpVotesTbale, {
            relationName: 'commentUpVotes',
        }),
    }),
    { onDelete: 'cascade' }
);

module.exports = {
    usersTable,
    userRelations,
};
