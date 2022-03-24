const mongodb = require("../app");
const Schema = mongodb.Schema;


const dataBase = new Schema({
    userName: {
        type: String,
        minlength: 4,
        maxlength: 255,
        required: true

    },
    password: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true

    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true

    },
    role:{
        type: String,
        minlength: 5,
        maxlength: 11,
        required: true
    }
});

module.exports = mongodb.model("dataBase", dataBase);