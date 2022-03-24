
//const superAdminSchema = require("../../models/superAdmin");
const tokenSchema = require("../../models/tokenSchema");
const dataBaseSchema = require("../../models/adminSchema");
const bcrypt = require("../../utility/bcrypt/bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const key = process.env.secret_key;



/**************** SIGN-UP Super Admin *****************/
const signUpSuperAdmin = async (req, res) => {
    try {


        const { userName, password, email, phone } = req.body;
        
        if (false) {
            return res.status(400).json({ "Bad Request:": `${result.error}` });
        } else {

            let userFound = await dataBaseSchema.findOne({ email: email });
            if (userFound) {
                return res.status(201).json({ "ALERT": `alredy exist` });
            }
            const hashpass = await bcrypt.encryption(password);
            let result = await dataBaseSchema.create({
                userName:userName,
                password: hashpass,
                email: email,
                phone:phone,
                role: "SUPER ADMIN"
            });

            //**************** if else ***********************/
            result ? res.status(200).json({ "ALERT": "Super ADMIN CREATED" }) :
                res.status(200).json({ "ALERT": "NOT CREATED" });
            // /*********************************/

        }
    } catch (error) {
        return res.status(500).json({ "ERROR": `${error}` });
    }

};








/***************  LOGIN - SUPER_ADMIN  ******************/
const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        // var value = Joi.object({
        //     username: Joi.string().min(2).max(255).required(),
        //     password: Joi.string().min(6).max(25).required(),
        // });
        // let result = value.validate(req.body);
        if (false) {
            return res.status(400).json({ "Bad Request:": `${result.error}` });
        } else {

            console.log("valid proceeded further");

            let result = await dataBaseSchema.findOne({ email });
            if (result) {
                let confirmPass = await bcrypt.compare(password, result.password);
                if (confirmPass) {
                    try {
                        let token_found = await tokenSchema.findOne({ email: result.email });
                        if (token_found) {
                            console.log(`User: ${result.email} is already Logged_Inn.`);
                            return res.status(406).json({ "ALERT": `User is already Logged_Inn` });
                        } else {
                            const token = await jwt.sign({ email: result.email }, key, { expiresIn: "1y" });
                            let create_token = await tokenSchema.create({
                                token: token,
                                email: result.email,
                                role: result.role
                            });
                            if (create_token) {

                                return res.status(200).json({ "ALERT": `User ${result.email} Logged Inn, Token: ${token}` });
                            }
                        }

                    }
                    catch (error) {
                        return res.status(500).json({ "Login TokenDB Error Admin": `${error}` });
                    }
                }
                return res.status(201).json({ "RESULT:": "User Loged Inn" })
            } else {
                res.status(400).json({ "ERROR user login": "user not found" });
            }
        }
    } catch (error) {
        return res.status(500).json({ "ERROR from login": `${error}` });
    }

};





/****************   LOGOUT    *****************/
const logout = async (req, res) => {
    try {

        const header = req.headers["authorization"];
        const token = header && header.split(" ")[1];
        console.log(`TOKEN:${token}`);


        let token_found = await tokenSchema.findOne({ token: token });
        if (token_found) {
            await tokenSchema.findOneAndDelete({ token: token });
            return res.status(200).json({ "Logout": `Successfully` });
        }
        else return res.status(404).json({ "ALERT": `The User Is Already LOGGED_OUT` });

    } catch (error) {
        return res.status(500).json({ "ERROR from logout": `${error}` });
    }

};
                                                                                                                               


/***************  ADD ADMIN  ******************/
const addAdmin = async (req, res) => {
    try {

        const { userName, password, email, phone } = req.body;
        let hashpass = await bcrypt.encryption(password);
        try {

            let userFound = await dataBaseSchema.findOne({ email: email });
            if (userFound) {
                return res.status(201).json({ "Email Exist": "Try Another Email" });
            } else {

                let addAdmin = await dataBaseSchema.create({
                    userName,
                    password: hashpass,
                    email,
                    phone,
                    role:"ADMIN"
                });
                if (addAdmin) return res.status(200).json({ "Created": addAdmin });

            }
        }
        catch (error) {
            return res.status(500).json({ "Un_Successful DB": `${error}` });
        }

    } catch (error) {
        return res.status(500).json({ "ERROR ADD ADMIN": `${error}` });
    }

};

/***************  DELETE ADMIN  ******************/
const deleteAdmin = async (req, res) => {
    try {
        const { email } = req.body;
        let foundAdmin = await dataBaseSchema.findOne({ email: email });
        if (foundAdmin) {
            console.log(foundAdmin);
            await dataBaseSchema.findOneAndDelete({ email: email });
            return res.status(200).json({ "ALERT delete Admin": "DELETED Successfully" });
        }
        else return res.status(404).json({ "ALERT delete Admin": "Not Found" });
    } catch (error) {
        return res.status(500).json({ "ERROR Delete Admin": error });
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



/***************  UPDATE ADMIN  ******************/
const allAdmin = async (req, res) => {
    try {

        let result = await dataBaseSchema.aggregate([
            {$match:{role:"ADMIN"}}
        ]);
        return res.status(200).json({ "ALERT": result });



    } catch (error) {
        return res.status(200).json({ "ERROR": `${error}` });

    }
};








module.exports = {
    login,
    signUpSuperAdmin,
    logout,
    addAdmin,
    deleteAdmin,
    updateAdmin,
    allAdmin
}