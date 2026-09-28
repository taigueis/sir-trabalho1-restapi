const { isConnected } = require("../config/db");
const { HttpError } = require("../utils/http");

// Responde logo 503 em vez de deixar o Mongoose pendurado à espera de uma ligação que não existe.
module.exports = (req, res, next) => {
  if (isConnected()) return next();
  next(
    new HttpError(
      503,
      "Base de dados indisponível. Configura MONGODB_URI no backend/.env (ver .env.example) e reinicia a API."
    )
  );
};
