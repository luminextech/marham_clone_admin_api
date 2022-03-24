const dataBaseSchema = require("../../models/adminSchema");
const tokenSchema = require("../../models/tokenSchema");
const bcrypt = require("../../utility/bcrypt/bcrypt");
const jwt = require("jsonwebtoken");
const key = process.env.secret_key;



/**************** SIGN-UP Admin *****************/
const adminSignUp = async (req, res) => {
    try {
        let { userName, password, email, phone } = req.body;

        let adminFound = await dataBaseSchema.findOne({ email: email });
        if (adminFound) {
            return res.status(201).json({ "ALERT": "Please Try Another Email" });
        } else {
            const hashpass = await bcrypt.encryption(password);
            let created = await dataBaseSchema.create({
                userName: userName,
                password: hashpass,
                email: email,
                phone: phone,
                role: "ADMIN"
            }).then((created) => {
                return res.status(200).json({ "ALERT": created });
            }).catch((err) => {
                return res.status(500).json({ "ALERT ERROR ADMIN": err });
            });
        }
    } catch (error) {
        return res.status(500).json({ "ERROR admin": error });
    }
};





/**************** Login Admin *****************/
const adminLogin = async (req, res) => {
    try {
        let { email, password } = req.body;



        let adminFound = await dataBaseSchema.findOne({ email: email });
        if (!adminFound) {
            return res.status(404).json({ "ALERT": "Not Found" });
        } else {
            let confirmPass = await bcrypt.compare(password, adminFound.password);
            if (confirmPass) {
                try {
                    let token_found = await tokenSchema.findOne({ email: adminFound.email });
                    if (token_found) {
                        console.log(`User: ${adminFound.email} is already Logged_Inn.`);
                        return res.status(406).json({ "ALERT": `User is already Logged_Inn` });
                    } else {
                        console.log("User Logged Inn");
                        console.log("Result Admin :" + adminFound);
                        let token = await jwt.sign({ email: adminFound.email }, key, { expiresIn: "1y" });
                        let create_token = await tokenSchema.create({
                            token: token,
                            email: adminFound.email,
                            role: adminFound.role
                        });
                        if (create_token) {

                            return res.status(200).json({ "ALERT": `User ${adminFound.email} Logged Inn` });
                        }
                    }
                } catch (error) {
                    return res.status(500).json({ "ERROR:Token Catch": `${error}` });
                }
            }
        }
    } catch (error) {
        return res.status(500).json({ "ERROR admin": error });
    }
};



/***************  UPDATE ADMIN  ******************/
const updateAdmin = async (req, res) => {
    try {

        if (req.body.password) {
            console.log("Password");
            let hashpass = await bcrypt.encryption(req.body.password);
            const _id = req.params.id;
            let updated = await dataBaseSchema.findOneAndUpdate({ _id },{password:hashpass});
            if (updated) {
                return res.status(200).json({ "ALERT UPDATE": `Update password Successfully` });
            } else {
                return res.status(200).json({ "ALERT": "Not Updated password" });
            }

        }

        const _id = req.params.id;
        let updated = await dataBaseSchema.findOneAndUpdate({ _id }, req.body, { new: true });
        if (updated) {
            return res.status(200).json({ "ALERT UPDATE": `Update Successfully` });
        } else {
            return res.status(200).json({ "ALERT": "Not Updated" });
        }


    } catch (error) {
        return res.status(200).json({ "UPDATE ERROR": `${error}` });

    }
};


module.exports = {
    updateAdmin,
    adminSignUp,
    adminLogin
}