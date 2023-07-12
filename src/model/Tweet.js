import mongoose from "mongoose";


const tweetSchema =  mongoose.Schema({
    tweet: { type: String, required: true},
    date: { type: Date, default: Date.now},
});

const Tweet_Model = mongoose.model("Tweet", tweetSchema);

export default Tweet_Model;