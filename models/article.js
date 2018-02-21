var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
 link: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    default: false,
    required: true
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]

});
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;