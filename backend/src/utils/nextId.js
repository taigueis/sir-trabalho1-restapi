const Counter = require("../models/Counter");

// Gera o próximo id sequencial de uma coleção. O $inc é atómico, por isso não há ids repetidos.
async function nextId(name) {
  const counter = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: "after" }
  );
  return counter.seq;
}

module.exports = nextId;
