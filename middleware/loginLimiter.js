const rateLimit = require('express-rate-limit');
const { logEvents } = require("./logger");



const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, //limit each IP to 5 requests per windowMs
    message: {
        msg: 'Too many login attempts, please try again after 15 minutes'
    },
    handler: (req, res, next, options) => {
        logEvents(`Too many requests: ${options.message.msg}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
        res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


module.exports = loginLimiter
