// jshint esversion:6

const express = require("express")
const bodyPaser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyPaser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Artcle", articleSchema);


/////////////////////////////// Request targteing all articles ///////////////////

app.route("/articles")

.get(function(req, res) {
    Article.find()
    .then(function(foundarticles) {
        res.send(foundarticles);
    })
    .catch(function(err) {
        res.send(err)
    });
    
})

.post(function(req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save()
})

.delete(function(req, res) {
    Article.deleteMany({})
    .then(function() {
        res.send("successfully deleted all articles")
    })
    .catch(function(error) {
        console.log(error)
    });
    
});

/////////////////////////////// Request targteing specific articles ///////////////////

app.route("/articles/:articleTitle")

.get(function(req, res) {
    Article.findOne({title: req.params.articleTitle})
    .then(function(foundarticle) {
        if (foundarticle) {
            res.send(foundarticle)
        } else {
            res.send("no article matching that title was found.")
        }
        
    })

})


.put(function(req, res) {
        Article.findOneAndUpdate(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
           
        )
        .then( function() {
            res.send("successfully updated article.")        
            })
            .catch(function(err) {
                res.send(err)
    
            })
    })

    .delete(function(req, res) {
        Article.findOneAndDelete(
            {title: req.params.articleTitle}
        )
        .then(function() {
            res.send("successfully deleted the corresponding article")
        })
        .catch(function(err) {
            res.send(err)
        });
    });

    // .patch(function(req, res) {
    //     Article.findOneAndUpdate(
    //         {title: req.body.articleTitle},
    //         {$set: req.body}
    //     )
    //     .then( function() {
    //         res.send("successfully updated article.")
    //     })
    //     .catch(function(err) {
    //         res.send(err)

    //     })
    // });



app.listen(3000, function() {
    console.log("server is running on port 3000");
});

