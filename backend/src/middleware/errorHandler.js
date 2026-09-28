const { HttpError } = require("../utils/http");

const notFound = (req, res, next) => {
  next(new HttpError(404, `Rota não encontrada: ${req.method} ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ erro: err.message, ...(err.detalhes && { detalhes: err.detalhes }) });
  }

  if (err.name === "ValidationError") {
    const detalhes = Object.values(err.errors).map((e) => ({
      campo: e.path,
      mensagem: e.name === "CastError" ? `Valor inválido para ${e.path}.` : e.message,
    }));
    return res.status(400).json({ erro: "Dados inválidos.", detalhes });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON inválido no corpo do pedido." });
  }

  if (err.code === 11000) {
    return res.status(409).json({ erro: "Já existe um registo com esses dados." });
  }

  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor." });
};

module.exports = { notFound, errorHandler };
