const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;


const logEvents = async (msg, logFileName) => {
    const dateTime = format(new Date(), "yyyy-MM-dd\tHH:mm:ss");
    const logItem = `${dateTime}\t${uuid()}\t${msg}\n`;
    try {
        if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
            await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
        }
        await fsPromises.appendFile(path.join(__dirname, "..", "logs", logFileName), logItem);
    } catch (error) {
        console.error(error);
    }
}

const logger = (req, res, next) => {
    const logMsg = `${req.method}\t${req.url}\t${req.headers.origin}`;
    logEvents(logMsg, "reqLog.log");
    console.log(`${req.method}, ${req.path}`);
    next();
}

module.exports = { logEvents, logger };
