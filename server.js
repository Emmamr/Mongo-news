// npm requirements
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");

// require models
var db = require("./models");

// set a port
var PORT = process.env.PORT || 3000;

// initialize Express
var app = express();

// middleware
app.use(
  bodyParser.urlencoded({ 
    extended: false 
  }));
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraperFOne";


mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


app.get("/", function(req, res) {
  db.Article.find({}, null, { sort: {'_id': -1} }, function(error, data) {
    if (error) throw error;
    res.render("landing", { articleData: data })
  });
});

app.get("/saved", function(req, res) {
  db.Article.find({ saved: true }, null, { sort: {'_id': -1} }, function(error, data) {
    if (error) throw error;
    res.render("saved", { articleData: data })
  });
});

app.get("/scrape", function(req, res) {
  db.Article.find({}, function(err, currentArticles) {
    if (err) throw err;
    var currentArticleTitles = [];
    for (var i = 0; i < currentArticles.length; i++) {
      currentArticleTitles.push(currentArticles[i].title);
    }
    request("https://www.formula1.com/en/latest.html", function(error, response, html) {
      var $ = cheerio.load(html);
      $("div.articles").each(function(i, element) {
        var result = {};
        if (currentArticleTitles.indexOf($(element).data("title")) === -1) {
          result.title = $(element)
            .children()
            .find("h4")
            .text();
          result.link = $(element)
            .children()
            .find("a")
            .data("href");
          result.image = "";
          if ($(element).find("img").data("src")) {
            result.image = $(element).find("img").data("src");
          } 
          else if ($(element).children().find("figure").find("img").attr("src")) {
            result.image = $(element).find("img").attr("src");
          }
          else {
            result.image = '/assets/images/defaultf1.png';
          }
          db.Article.create(result)
            .then(function(dbArticle) {
              console.log(dbArticle);
            })
            .catch(function(err) {
              return res.json(err);
            });
        }
      });
      res.redirect("/");
    });
  });
});

app.put("/articles/:id", function(req, res) {
 db.Article.update({ _id: req.params.id }, { $set: req.body }, function(err, result) {
    if (err) throw err;
    console.log(result);
    res.sendStatus(200);
  });
});

app.post("/articles/:id", function(req, res) {
  db.Comment.create(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: dbComment._id } }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
 db.Article.findOne({ _id: req.params.id })
    .populate("comments")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.delete("/comments/:id", function(req, res) {
  db.Comment.remove({ _id: req.params.id }, function(err, data) {
    if (err) throw err;
    console.log(data);
    res.sendStatus(200);
  })
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});