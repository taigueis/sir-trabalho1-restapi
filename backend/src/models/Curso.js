const { Schema, model } = require("mongoose");

const cursoSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, immutable: true },
    nomeDoCurso: {
      type: String,
      required: [true, "O nome do curso é obrigatório."],
      trim: true,
      minlength: [3, "O nome do curso deve ter pelo menos 3 caracteres."],
      maxlength: [120, "O nome do curso não pode exceder 120 caracteres."],
    },
  },
  {
    versionKey: false,
    // Esconde o _id do Mongo: a API expõe apenas o id numérico, compatível com o json-server.
    toJSON: {
      transform: (doc, ret) => {
        delete ret._id;
        return ret;
      },
    },
  }
);

module.exports = model("Curso", cursoSchema);
