const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const root = require("./routes/root");
const authRoute = require("./routes/authRoutes");
const userRoute = require("./routes/userRoutes");
const noteRoute = require("./routes/noteRoutes");
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const dbConnect = require("./config/dbConnection");
const mongoose = require("mongoose");
const { logEvents } = require("./middleware/logger");
// const dbRun = require("./dbConnect");



// dbRun().catch(console.dir)
dbConnect();
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/", root);
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/notes", noteRoute);


app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"))
    } else if (req.accepts("json")) {
        res.json({ msg: "Data not found" });
    } else res.type("txt").send("404 not found");
})




app.use(errorHandler);

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB!");
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
})
mongoose.connection.on("error", err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, "mongoErrLog.log")
})

