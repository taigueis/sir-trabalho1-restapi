const { Schema, model } = require("mongoose");

const inteiro = {
  validator: Number.isInteger,
  message: "{PATH} deve ser um número inteiro.",
};

const alunoSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, immutable: true },
    nome: {
      type: String,
      required: [true, "O nome é obrigatório."],
      trim: true,
      minlength: [2, "O nome deve ter pelo menos 2 caracteres."],
      maxlength: [60, "O nome não pode exceder 60 caracteres."],
    },
    apelido: {
      type: String,
      required: [true, "O apelido é obrigatório."],
      trim: true,
      minlength: [2, "O apelido deve ter pelo menos 2 caracteres."],
      maxlength: [60, "O apelido não pode exceder 60 caracteres."],
    },
    idCurso: {
      type: Number,
      required: [true, "O curso (idCurso) é obrigatório."],
      validate: inteiro,
      index: true,
    },
    anoCurricular: {
      type: Number,
      required: [true, "O ano curricular é obrigatório."],
      min: [1, "O ano curricular mínimo é 1."],
      max: [5, "O ano curricular máximo é 5."],
      validate: inteiro,
    },
    idade: {
      type: Number,
      min: [16, "A idade mínima é 16."],
      max: [99, "A idade máxima é 99."],
      validate: inteiro,
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform: (doc, ret) => {
        delete ret._id;
        return ret;
      },
    },
  }
);

module.exports = model("Aluno", alunoSchema);
