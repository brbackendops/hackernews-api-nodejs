const authMiddleware = (req, res, next) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({
                status: 'unauthorized',
                error: 'user not logged in',
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    authMiddleware,
};
