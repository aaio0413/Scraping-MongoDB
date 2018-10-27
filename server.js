const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const request = require("request");
const cheerio = require("cheerio");
const path = require("path");

const logger = require("morgan");
const axios = require("axios");

const db = require("./models");
const PORT = 3000;

// Initialize Express
const app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// mongoose.connect("mongodb://localhost/scarapingmongo", { useNewUrlParser: true });
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoAnimeLists";

mongoose.Promise = Promise; // Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true }
); // Connect to the Mongo DB

app.get("/", function(req, res) {
  db.Card.find({})
    .then(function(dbCard) {
      //   if (dbCard) {
      //     const hundleBars = {
      //       items: dbCard
      //     };
      //     console.log("the hundlebars-object is: ", hundleBars);
      //     res.render("index", handlebars);
      //   } else {
      //     const sample = $("<div> 'there's nothing to show yet' </div>")
      //     res.render(sample);
      //   }
      if (dbCard) {
        res.render("index");
      }
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/scrape", function(req, res) {
  console.log("is this running? page request");
  // First, we grab the body of the html with request
  axios
    .get("http://video.fc2.com/search/video/?keyword=anime")
    .then(function(masData) {
      console.log("is this running? scraping");
      // console.log("the data is: ", res.data);
      // console.log(masData.data);
      const $ = cheerio.load(masData.data);

      // let num = 0;
      // while(num < 11) {
      $("li.c-boxList-111_video")
        .each(function(i, element) {
          // console.log("is this running? storing data", element);
          // console.log('index is ', i);

          // Save an empty result object
          let result = {};

          // Add the text and href of every link, and save them as properties of the result object
          // const img = $(element).find("div").eq(1).children("a").children("div").children("div").css("background-image");
          // const title = $(element).find("div").eq(2).find("a").text();
          // const link = $(element).find("div").eq(2).find("a").attr("href");
          // const summary = $(element).find("div").eq(2).find("div").eq(3).text();
          let img = $(element)
            .find("div")
            .children("a")
            .children("div")
            .children("div")
            .css("background-image");
          img = img
            .replace("url(", "")
            .replace(")", "")
            .replace(/\"/gi, "");
          let title = $(element)
            .find("div")
            .next()
            .children("a")
            .text();
          const link = $(element)
            .find("div")
            .find("a")
            .attr("href");
          const summary = $(element)
            .find("div")
            .next()
            .children("div")
            .next()
            .next()
            .text();

          let newSummary = JSON.stringify(summary);
          newSummary = summary.split("");
          if (newSummary.length > 15) {
            newSummary = newSummary.slice(0, 45);
          }
          console.log("the summary is here: ", newSummary);
          console.log("the summary's length is: ", newSummary.length);

          newSummary = newSummary.join("") + "...";

          console.log("the items: ", img + title + link + newSummary);

          result = {
            img,
            title,
            link,
            newSummary
          };
          console.log("the data it's scraping is: ", result);

          db.Card.create(result)
            .then(function(dbCard) {
              // View the added result in the console
              console.log(dbCard);
            })
            .catch(function(err) {
              // If an error occurred, send it to the client
              return res.json(err);
            });
        })
        .catch(function(err) {
          console.log("err", err);
        });

      res.send("Scrape Complete"); //scraping success
    })
    .catch(function(err) {
      return res.json(err);
    });
});

// Route for getting all Articles from the db
app.get("/anime_lists", function(req, res) {
  // Grab every document in the Articles collection
  db.Card.find({})
    .then(function(dbCard) {
      const handleBars = {
        items: dbCard
      };
      console.log("the hundlebars-object is: ", handleBars);
      // console.log("Ok, data is loaded.");

      // hb.render(__dirname + "/views/index.handlebars", handleBars).then(
      //   renderedHtml => {
      //     res.send({ html: renderedHtml });
      //   }
      // );
      // res.render("item", { items: handleBars.items });
      res.json(handleBars);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.send("there's error on getting the info", err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/anime_lists/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Card.findOne({ _id: req.params.id })

    .populate("memo")
    .then(function(dbCard) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbCard);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.post("/anime_lists/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Memo.create(req.body)
    .then(function(dbMemo) {
      console.log("memo is created successfully", dbMemo);

      return db.Card.findOneAndUpdate(
        { _id: req.params.id },
        { memo: dbMemo._id },
        { new: true }
      );
    })
    .then(function(dbCard) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbCard);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
