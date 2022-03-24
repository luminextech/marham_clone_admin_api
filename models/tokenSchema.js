const mongodb = require("../app");
const Schema = mongodb.Schema;


const tokenSchema = new Schema({
    token: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

module.exports = mongodb.model("tokenSchema", tokenSchema);