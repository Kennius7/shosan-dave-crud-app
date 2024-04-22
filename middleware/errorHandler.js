const { logEvents } = require("./logger");


const errorHandler = (err, req, res, next) => {
    const errData = `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`;
    logEvents(errData, "errLog.log");
    console.log(err.stack);
    const status = res.statusCode ? res.statusCode : 500;
    res.status(status).json({ msg: err.message });
}

module.exports = errorHandler;
