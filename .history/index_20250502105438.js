const express = require("express");
const app = express();

app.use(express.json()); // permet d'envoyer et recevoir du JSON

// On place un callback, la fonction qui sera appelé lorsque l'utilisateur accède a la route indiqué
app.get("/user/list", (req, res) => {
  // L ORDRE DES PARAMS EST IMPORTANT
  // La méthode send permet de renvoyer quelque chose au client

  const users = [
    { id: 1, email: "luc@yahoo.fr" },
    { id: 2, email: "jaj@yahoo.fr" },
    { id: 3, email: "moc@yahoo.fr" },
  ];

  res.json(users);
});

port = 5000;
app.listen(port, () => {
  console.log("Le serveur écoute sur le port ", port);
});
