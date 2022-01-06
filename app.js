const express = require("express");

const app = express();
app.use(express.static("./public"));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// **** ITS A VERY SIMPLE EXPRESS APP (Photify - ClassPlus InternShip Assignment) ****
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// No routes defination is required for this project
// No middlewares are required for this project
// No security is required for this project - Its a Static page

// Please check the public/js for the implementation part

app.listen(process.env.PORT || 3000, () => console.log("Server running"));
