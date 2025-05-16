const express = require("express");
const app = express();

app.use(express.json()); // permet d'envoyer du JSON

// On place un callback, la fonction qui sera appelé lorsque l'utilisateur accède a la route indiqué
app.get("/", (req, res) => {
  // L ORDRE DES PARAMS EST IMPORTANT
  // La méthode send permet de renvoyer quelque chose au client
  res.send("200 OK");
});

app.listen(5000, () => {
  console.log("Le serveur écoute sur le port 5000 !!");
});
