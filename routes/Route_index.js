

module.exports = (app)=>{
    app.use("/api/superAdmin",require("./superAdmin/superAdmin"));
    app.use("/api/admin",require("./admin/adminRoutes"));
    // app.use("/api/user",superAdmin.logout);
};
