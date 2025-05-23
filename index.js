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

  // Validation
  if (product.nom == null || product.nom == "" || product.nom.length > 20 || product.description.length > 50) {
    return res.sendStatus(400); // Bad request
  }

  // Verification si le nom du produit existe déjà
  connexion.query("SELECT * FROM product WHERE name = ?", [product.nom], (err, line) => {
    if (line.length > 0) {
      return res.sendStatus(409); // Conflict
    }

    connexion.query("INSERT INTO product (name, description) VALUES (?, ?)", [product.nom, product.description], (err, line) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500); // Internal Server error
      }
      res.status(201).json(product); // Created
    });
  });

  // Ici c'est l'ordre de déclaration qui prime, il n'y a pas de cohérence entre les noms
});

app.get("/product/list", (req, response) => {
  connexion.query("SELECT * FROM product", (err, item) => {
    if (err) {
      console.error(err);
      return res.serverStatus(500); // Internal Server error
    }

    return response.json(item);
  });
});

port = 5000;
app.listen(port, () => {
  console.log("Le serveur écoute sur le port", port);
});
