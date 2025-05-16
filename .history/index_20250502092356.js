const express = require("express");
const app = express();

// On place un callback, la fonction qui sera appelé lorsque l'utilisateur accède a la route indiqué
app.get("/", (req, res) => {
  // La méthode send permet de renvoyer quelque chose au client
  res.send("200 OK");
});

app.listen(5000, () => {
  console.log("Le serveur écoute sur le port 5000 !!");
});
