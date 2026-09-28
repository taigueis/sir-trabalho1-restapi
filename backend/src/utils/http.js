class HttpError extends Error {
  constructor(status, message, detalhes) {
    super(message);
    this.status = status;
    this.detalhes = detalhes;
  }
}

// Os ids da API são inteiros positivos (1, 2, 3…), tal como no json-server.
function parseId(raw, nome = "id") {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) {
    throw new HttpError(400, `O ${nome} deve ser um inteiro positivo.`);
  }
  return n;
}

// Só deixa passar os campos permitidos: ignora id e qualquer campo desconhecido enviado pelo cliente.
function pick(body, keys) {
  if (body === undefined || body === null) return {};
  if (typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "O corpo do pedido deve ser um objeto JSON.");
  }
  return Object.fromEntries(keys.filter((k) => k in body).map((k) => [k, body[k]]));
}

module.exports = { HttpError, parseId, pick };
