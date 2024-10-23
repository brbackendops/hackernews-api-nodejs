const { z } = require('zod');

const postSchema = z.object({
    title: z.string(),
    content: z.string(),
    userId: z.number(),
    url: z.string().nullable(),
    points: z.number().nullable(),
    commentCount: z.number().nullable(),
    created_at: z.date().nullable(),
    updated_at: z.date(),
});

const createPostSchema = postSchema.omit({
    commentCount: true,
    points: true,
    created_at: true,
    updated_at: true,
});
const updatePostSchema = postSchema.omit({
    commentCount: true,
    points: true,
    created_at: true,
});

module.exports = {
    createPostSchema,
    updatePostSchema,
};
