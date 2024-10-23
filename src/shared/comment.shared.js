const { z } = require('zod');

const commentSchema = z.object({
    userId: z.optional(z.string()),
    postId: z.optional(z.string()),
    parentCommentId: z.optional(z.string()),
    content: z.string(),
    depth: z.optional(z.number()),
    commentCount: z.optional(z.number()),
    points: z.optional(z.number()),
});

const createCommentSchema = commentSchema.omit({
    points: true,
    commentCount: true,
    depth: true,
});

module.exports = {
    createCommentSchema,
};
