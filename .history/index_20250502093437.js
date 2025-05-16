const express = require("express");
const app = express();

app.use(express.json()); // permet d'envoyer et recevoir du JSON

// On place un callback, la fonction qui sera appelé lorsque l'utilisateur accède a la route indiqué
app.get("/user/list", (req, res) => {
  // L ORDRE DES PARAMS EST IMPORTANT
  // La méthode send permet de renvoyer quelque chose au client
 
const = [
{id: 1, email: "luc@yahoo.fr"}
]
});

app.listen(5000, () => {
  console.log("Le serveur écoute sur le port 5000 !!");
});
