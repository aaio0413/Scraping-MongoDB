const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
const MemoSchema = new Schema({
  body: String
});

// This creates our model from the above schema, using mongoose's model method
const Memo = mongoose.model("Memo", MemoSchema);

module.exports = Memo;
