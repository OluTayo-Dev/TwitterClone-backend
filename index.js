import express from "express";
//import mongoose from "mongoose"
import * as dotenv from "dotenv";
import connectDB from "./src/config/connect.js";
import TwitRoute from "./src/routes/TwitRoute.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";


dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    cors({
        origin:["http://localhost:3000", "http://localhost:3001",]
    
    })
);


app.use("/api", TwitRoute);
// app.get("/", (req, res) => {
//     res.send("Hello");
// });

async function connect() {
    try{
        app.listen(8000, () =>{
            connectDB(process.env.MONGODB_PASSWORD);
            console.log("server is running on port 8000");
        });
    } catch (err) {
        console.log(err);
    }
}
connect();


//jwt token

// import crypto from 'crypto'
// const secretKey = crypto.randomBytes(32).toString('hex');
// console.log(secretKey);