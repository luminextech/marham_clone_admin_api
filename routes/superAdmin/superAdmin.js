const Router = require("express").Router();
const superAdminAuth = require("../../middleware/superAdminAuth");
const superAdminController = require("../../controllers/superAmin/login");


/*******************  SuperAdmin SignUp  *******************/
Router.route("/signup").post(superAdminController.signUpSuperAdmin);


/*******************  SuperAdmin Login  *******************/
Router.route("/login").post(superAdminController.login);


/*******************  SuperAdmin Logout  *******************/
Router.route("/logout").get(superAdminController.logout);


/*******************  SuperAdmin Add Admin  *******************/
Router.route("/addadmin").post(superAdminAuth,superAdminController.addAdmin);


/*******************  SuperAdmin Delete Admin  *******************/
Router.route("/deleteadmin").delete(superAdminAuth,superAdminController.deleteAdmin);

/*******************  SuperAdmin Update Admin  *******************/
Router.route("/updateadmin/:id").put(superAdminAuth,superAdminController.updateAdmin);

/*******************  SuperAdmin GET all Admin  *******************/
Router.route("/alladmin").get(superAdminAuth,superAdminController.allAdmin);


module.exports = Router;
