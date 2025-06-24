const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwtUtils = require("jsonwebtoken");
const interceptor = require("./middleware/jwt-interceptor");

const app = express();

app.use(cors());
app.use(express.json()); // permet d'envoyer et recevoir du JSON

const connexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "projet-angular",
});

// On place un callback, la fonction qui sera appelé lorsque l'utilisateur accède a la route indiqué
connexion.connect((err) => {
  if (err) {
    console.error("Erreur de conexion à la base de données :", err);
    return;
  }
  console.log("Connecté à la base de données SQL");
});

app.get("/user/list", (req, res) => {
  // L ORDRE DES PARAMS EST IMPORTANT

  const users = [
    { id: 1, email: "luc@yahoo.fr" },
    { id: 2, email: "jaj@yahoo.fr" },
    { id: 3, email: "moc@yahoo.fr" },
  ];

  res.json(users);
});

app.get("/", (req, res) => {
  // La méthode send permet de renvoyer quelque chose au client
  res.send("<h1>C'est une API</h1>");
});

app.post("/product", interceptor, (req, res) => {
  const product = req.body;

  if (req.user.role != "vendeur" && req.user.role != "administrateur") {
    return res.sendStatus(403);
  }

  if (product.nom == null || product.nom == "" || product.nom.length > 20 || product.description.length > 50) {
    // Validation
    return res.sendStatus(400); // Bad request
  }

  // Verification si le nom du produit existe déjà
  connexion.query("SELECT * FROM product WHERE name = ?", [product.nom], (err, line) => {
    if (line.length > 0) {
      return res.sendStatus(409); // Conflict
    }

    connexion.query("INSERT INTO product (name, description, id_creator) VALUES (?, ?, ?)", [product.nom, product.description, req.user.id], (err, line) => {
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
      return res.send(500); // Internal Server error
    }

    return response.json(item);
  });
});

app.delete("/product/:id", interceptor, (req, res) => {
  // On récupère le produit
  connexion.query("SELECT * FROM product WHERE id = ?", [req.params.id], (err, lines) => {
    // Si il y a une erreur
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    // Si le produit est inconnu
    if (lines.length == 0) {
      return res.sendStatus(404);
    }

    // SI l'utilisateur est connecté et utilisateur
    const isOwner = req.user.role == "vendeur" && req.user.id == lines[0].id_creator;

    // Si il n'est ni propriétaire du produit et administrateur
    if (!isOwner && req.user.role != "administrateur") {
      return res.sendStatus(403);
    }

    // On supprime le produit
    connexion.query("DELETE FROM product WHERE id = ?", [req.params.id], (err, lines) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }

      return res.sendStatus(204);
    });
  });
});

app.post("/inscription", (req, res) => {
  const user = req.body;
  const passwordHash = bcrypt.hashSync(user.password, 10);
  connexion.query("INSERT INTO user (email, password, role_id) VALUES (?, ?, 1)", [user.email, passwordHash], (err, line) => {
    if (err && err.code == "ER_DUP_ENTRY") {
      return res.sendStatus(409); // Conflit
    }

    if (err) {
      return res.sendStatus(500);
    }

    user.id = res.insertId;
    res.json(user);
  });
});

app.post("/connexion", (req, res) => {
  connexion.query(
    `
    SELECT u.id, u.email, u.password, r.name
    FROM user u 
    JOIN role r ON u.role_id = r.id 
    WHERE email = ?
    `,
    [req.body.email],
    (err, lines) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }

      if (lines.length === 0) {
        return res.sendStatus(401);
      }

      const formPassword = req.body.password;
      const fetchPassword = lines[0].password;

      const compatible = bcrypt.compareSync(formPassword, fetchPassword);

      if (!compatible) {
        return res.sendStatus(401);
      }
      return res.send(
        jwtUtils.sign(
          {
            sub: req.body.email,
            role: lines[0].name,
            id: lines[0].id,
          },
          "azerty123"
        )
      );
    }
  );
});

app.listen(5000, () => {
  console.log("Le serveur écoute sur le port", 5000);
});
