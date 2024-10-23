const transformRequest = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = transformRequest;
