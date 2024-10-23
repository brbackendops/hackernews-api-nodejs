const { z } = require('zod');

const sortBySchema = z.enum(['points', 'recent']);
const orderBySchema = z.enum(['asc', 'desc']);

const paginationSchema = z.object({
    limit: z.number({ coerce: true }).optional().default(10),
    page: z.number({ coerce: true }).optional().default(1),
    sortBy: sortBySchema.optional().default('points'),
    orderBY: orderBySchema.optional().default('desc'),
    author: z.optional(z.string()),
    site: z.optional(z.string()),
});

module.exports = {
    paginationSchema,
};
