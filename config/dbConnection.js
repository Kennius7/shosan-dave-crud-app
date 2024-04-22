const mongoose = require("mongoose");
require("dotenv").config();



const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log("Database connected!")
    } catch (err) {
        console.log(err);
        console.log("Error connecting database!")
    }
}

module.exports = dbConnect;
