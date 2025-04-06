import mongoose from "mongoose";
import "dotenv/config";

const dbURL = process.env.DBURL;


const dbConnection = async () => {
    try {
        const con = await mongoose.connect(dbURL);
        console.log("Database Connection successfully");
    } catch (error) {
        console.log("Sorry, we con't connect with database.");
        console.log(error.message);
        throw new Error("Database Connection Failed");
    }
}

export default dbConnection;