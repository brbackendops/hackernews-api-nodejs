require('dotenv').config();

const { drizzle } = require('drizzle-orm/postgres-js');
const { z } = require('zod');
const { usersTable, userRelations } = require('./schema/users');
const {
    postsTable,
    postsUpVotesTable,
    postsRelation,
    postsUpVotesRelation,
} = require('./schema/posts');
const {
    commentsTable,
    commentsUpVotesTbale,
    commentUpVotesRelation,
    commentRelations,
} = require('./schema/comments');

const EnvSchema = z.object({
    DATABASE_URL: z.string(),
});

const EnvConfig = EnvSchema.parse(process.env);

const db = drizzle({
    connection: {
        url: EnvConfig.DATABASE_URL,
        ssl: false,
        casing: 'snake_case',
    },
    schema: {
        usersTable,
        postsTable,
        commentsTable,
        postsUpVotesTable,
        commentsUpVotesTbale,
        userRelations,
        postsRelation,
        commentRelations,
        commentUpVotesRelation,
        postsUpVotesRelation,
    },
});

module.exports = db;
