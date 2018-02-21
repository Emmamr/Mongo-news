var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
 body: {
    type: String,
    validate: [
      function(input) {
        return input.length >= 1;
      },
      "Comment should not be blank."
    ]
  }
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;