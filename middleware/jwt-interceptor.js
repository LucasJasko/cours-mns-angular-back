const jwtUtils = require("jsonwebtoken");

function intercept(req, res, next) {
  const token = req.headers.authorization;

  try {
    if (!token || !jwtUtils.verify(token, "azerty123")) {
      console.log("token: " + token);
      console.log("value: " + jwtUtils.verify(token, "azerty123"));

      return res.sendStatus(401);
    }

    const jwtParts = token.split("."); // Decoupe en 3 partie
    const jwtBodyBase64 = jwtParts[1]; // Recupère la partie data du jwt
    const jwtBodyDecoded = atob(jwtBodyBase64); // Decode la base 64
    const body = JSON.parse(jwtBodyDecoded); // On transforme le json en objet JS

    req.user = body;
  } catch (e) {
    //  cas où le format du jwt est invalide
    console.log("Format invalide");
    console.log(e);

    return res.sendStatus(401);
  }

  next();
}

module.exports = intercept;
