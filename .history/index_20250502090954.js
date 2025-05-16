const express = require("express");
const app = express();

app.listen(500, () => {
  console.log("Le serveur écoute sur le port 5000");
});
