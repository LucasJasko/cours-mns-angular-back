const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json()); // permet d'envoyer et recevoir du JSON

const connexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "projet-angular",
});

connexion.connect((err) => {
  if (err) {
    console.error("Erreur de conexion à la base de données :", err);
    return;
  }
  console.log("Connecté à la base de données SQL");
});

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

app.get("/", (req, res) => {
  res.send("<h1>C'est une API</h1>");
});

app.post("/product", (req, res) => {
  const product = req.body;
  console.log(req.body);

  res.json(product);
});

app.get("/product/list", (req, response) => {
  connexion.query("SELECT * FROM product", (err, item) => {
    if (err) {
      console.error(err);
      return res.serverStatus(500);
    }

    return response.json(item);
  });
});

port = 5000;
app.listen(port, () => {
  console.log("Le serveur écoute sur le port", port);
});
