const express = require("express");
const app = express();

// On place un callback, la fonction qui sera appelé lorsque l'utilisateur accède a la route indiqué
app.get("/", (req, res) => {});

app.listen(5000, () => {
  console.log("Le serveur écoute sur le port 5000 !!");
});
