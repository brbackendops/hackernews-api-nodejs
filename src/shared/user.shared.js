const { z } = require('zod');

const userSchema = z.object({
    username: z.string().describe('username of the user'),
    password: z.string().describe('password of the user'),
    location: z
        .string()
        .nullable()
        .describe('to know the location of the user'),
    email: z.string().email().describe('email of the user'),
});

const loginSchema = userSchema.omit({ username: true, location: true });
const updateSchema = userSchema.omit({ email: true });

module.exports = {
    registerSchema: userSchema,
    loginSchema,
    updateSchema,
};
