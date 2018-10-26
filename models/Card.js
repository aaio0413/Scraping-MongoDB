var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var CardSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  newSummary: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  memo: {
    type: Schema.Types.ObjectId,
    ref: "Memo"
  }
});

// This creates our model from the above schema, using mongoose's model method
const Card = mongoose.model("Card", CardSchema);

// Export the Article model
module.exports = Card;
