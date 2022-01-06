const express = require("express");

const app = express();
app.use(express.static("./public"));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// **** ITS A VERY SIMPLE EXPRESS APP (Photify - ClassPlus InternShip Assignment) ****
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// No middlewares are required for this project
// No security is required for this project - Its a Static page

app.get("/home", (_, res) => res.redirect("/"));

app.all("*", (_, res) =>
  res.sendFile("./public/error.html", { root: __dirname })
);

// Server Listening 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
