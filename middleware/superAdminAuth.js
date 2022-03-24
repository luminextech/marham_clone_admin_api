const jwt = require("jsonwebtoken");
const dataBaseSchema = require("../models/adminSchema");
const tokenSchema = require("../models/tokenSchema");
const key = process.env.secret_key;
const superAdmin = async (req, res, next) => {
    try {
        let header = req.headers["authorization"];
        let token = header && header.split(" ")[1];


        /*************** Checking If TOKEN is Available Or Not On Front End ******************/
        if (token == null) {
            return res.status(404).json({ "ERROR AUTH TOKEN": "NOT FOUND" });
        } else {
        
            /*************** Checking If Session is Created Or Not ******************/
            let USER_TOKEN = await tokenSchema.findOne({ token: token });
            if (USER_TOKEN) {
                jwt.verify(token, key, async (err, user) => {
                    if (err) {
                        return res.status(404).json({ "ERROR AUTH TOKEN": err });
                    } else {
                   /*************** Checkin If The User is Authorized Or Not ******************/
                        console.log(`super Admin AUTH ${user.email}`);
                        let USER = await dataBaseSchema.findOne({ email: user.email });
                        if (USER && USER.role === "SUPER ADMIN") {
                            /*************** Passing to the Api if Authenticated ******************/
                            console.log(`The Super Admin is Authorized`);
                            next();
                        } else {
                            return res.status(401).json({ "Authentication Error": "Access Denied" });
                        }
                    }
                });
            } else {
                return res.status(404).json({ "Authentication Error": "PLEASE LOGIN FIRST" });
            }



        }

    } catch (error) {
        return res.status(500).json({ "ERROR AUTH SUPER ADMIN": error });
    }
}

module.exports = superAdmin