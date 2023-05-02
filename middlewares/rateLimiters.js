const rateLimit = require('express-rate-limit');
exports.logInLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // limit each IP to 100 requests per windowMs
    // message: 'Too many login requests. Please try again later'
    handler: (req, res) => {
        let err = new Error('Too many login requests. Please try again later');
        statusCode = 429;
        return next(err);
    }
});