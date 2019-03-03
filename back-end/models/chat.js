const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const ChatSchema = new Schema(
    {
        name: String,
        message: String
    },
    {
        collection: "chats"
    }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Chat", ChatSchema);