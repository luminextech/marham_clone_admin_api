const Router = require("express").Router();

const adminController = require("../../controllers/admin/admin");


/*******************  Admin SignUp  *******************/
Router.route("/signup").post(adminController.adminSignUp);


/*******************  Admin Login  *******************/
Router.route("/login").post(adminController.adminLogin);

module.exports = Router;