//******************** REQUIRES *************************//
const express = require("express");
const app = express();
const mongodb = require("mongoose");
require("dotenv").config();


//******************** JSON ENABLING *************************//
app.use(express.urlencoded({extended:false}));
app.use(express.json()); //For JSON Enable...

//*******  boss's code for parser *************/
const { fileParser } = require('express-multipart-file-parser');
app.use(
    fileParser({
      rawBodyOptions: {
        limit: '30mb', //file size limit
      },
      busboyOptions: {
        limits: {
          fields: 50, //Number text fields allowed
        },
      },
    })
  );






//********************* .ENV VERIABLES *********************//
const PORT = process.env.PORT || 3000;
const url = process.env.URL;




//******************** MONGOODB SETUP  ***********************//

mongodb.connect(url, { useNewUrlParser: true }).then(() => {
    console.log("MongoDB is Connected")
});

module.exports = mongodb;


//******************** ROUTES SETUPS  ***********************//
// const routes = require("./routes/superAdmin/superAdmin");
// app.use(routes);

require("./routes/Route_index")(app);


//****************** PORT ASSIGNING *************************//
app.listen(PORT,"localhost",()=>{
    console.log(`PORT ${PORT} is connected to the LOCALHOST`);
});