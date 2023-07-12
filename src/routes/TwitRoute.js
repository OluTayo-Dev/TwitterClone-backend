import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Model from "../model/TwitterSignup.js";
import Tweet_Model from "../model/Tweet.js";

 




const TwitRoute = express.Router();
//get all
TwitRoute.get("/getAll", async (req, res) =>{
    try {
        const data = await Model.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message});
    }
});
// auth register

TwitRoute.post("/register", (req, res) =>{
    const {firstName, lastName, email, password } = req.body;
    if( password.length < 8) {
        return res
                  .status(400)
                  .json({ message: "password is less than 8 characters"});
    }
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "all fields are required "})
    }
    if (email.indexOf("@") === -1) {
        return res.status(400).json({ message: "invalid email"});
    }
    if (email.indexOf(".") === -1) {
        return res.status(400).json({ message: "invalid email"});
    }

    try {
        bcrypt.hash(password, 10).then(async (hash) => {
            await Model.create({ firstName, lastName, email,  password:  hash}).then(
                (user) => {
                    const maxAge = 3 * 60 * 60;
                    const token = jwt.sign(
                        { id: user._id, email },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: maxAge }
                    );
                    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000});
                    res.status(201).json({ message: "User successfully created", user});
                }
            );
      });

     } catch (err) {
        res.status(400).json({
            messsage: "User not successfully created",
            error: err.message,
        });
     }
    });

    //auth login
    TwitRoute.post("/login", async (req, res, next) =>{
        const { email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "email or password not provided "});
        }
        try{
            const user = await Model.findOne({email});
            if (!user){
                res.status(400)
                   .json({ message: "Login not successsful", error: "User not found"});

            } else {
                bcrypt.compare(password, user.password).then(function (result) {
                    //console.log(password, user.password);
                    if (result) {
                       const maxAge = 3 * 60 * 60;
                        const token = jwt.sign(
                            { id: user._id, email },
                            process.env.JWT_SECRET_KEY,
                            { expiresIn: maxAge }
                        );
                        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000});
                        res.status(201).json({ message: "Login successful", user, token});
                    } else {
                        res.status(400).json({ message: "Invalid Credentials "});
                    }
                })
            }
        } catch (err) {
            res.status(400).json({ message: "An error occurred", error: err.message });
        }
    });

    //create Tweet
    TwitRoute.post("/createTweet", async (req, res) => {
        const { tweet } = req.body;
        try {
            await Tweet_Model.create({ tweet }).then((tweet) =>{
                res.status(201).json({ message: "Tweet successfully created", tweet})
            });
        } catch (err) {
            res.status(400).json({
                message: "Tweet not successfully created",
                error: err.message,
            })
        }
    });

//get All Tweet
TwitRoute.get("/getAllTweet", async (req, res) => {
    try{
        await Tweet_Model.find().then((tweet) => {
            res.status(201).json({ message: "Tweet successfully listed", tweet});
        });
    } catch (err) {
        res.status(400).json
        ({
             message: "Tweet not successfully created", 
             error: err.message,
        })
    }
})
     
                                                                                                                                                                                                                                                                                              



export default TwitRoute;