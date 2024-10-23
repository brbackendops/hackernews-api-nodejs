module.exports = class HTTPException extends Error {
    constructor(statusCode, message) {
        super(message);
        this.name = 'HTTPException';
        this.statusCode = statusCode;
        this.message = message;
    }
};
