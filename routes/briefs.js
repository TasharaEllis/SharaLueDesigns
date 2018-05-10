var express=require("express");
var router = express.Router();
var Brief = require("../models/brief");
var middleware = require("../middleware");

//INDEX 
router.get("/", function(req, res){
    // Get all data from DB
    Brief.find({}, function(err, allBriefs){
       if(err){
           console.log(err);
       } else {
          res.render("briefs/index",{briefs:allBriefs, currentUser: req.user});
       }
    });
});

//CREATE 
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to array
    var firstname = req.body.firstname;
    var lastname= req.body.lastname;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newBrief = {firstname: firstname, lastname: lastname, author:author};
    // Create new data and save to DB
    Brief.create(newBrief, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to briefs page
            console.log(newlyCreated);
            res.redirect("/briefs");
        }
    });
});

//NEW 
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("briefs/new"); 
});

// SHOW 
router.get("/:id", function(req, res){
    //find the brief with provided ID
    Brief.findById(req.params.id).populate("comments").exec(function(err, foundBrief){
        if(err || !foundBrief){
            req.flash("error", "Brief not found");
            res.redirect("back");
        } else {
            console.log(foundBrief);
            //render show template with that brief
            res.render("briefs/show", {brief: foundBrief});
        }
    });
});

//EDIT
router.get("/:id/edit", middleware.checkBriefOwnership, function(req, res) {
    Brief.findById(req.params.id, function(err, foundBrief){
        res.render("briefs/edit", {brief: foundBrief});
    });
});

//UPDATE
router.put("/:id", middleware.checkBriefOwnership, function(req, res){
    //find and update the correct brief
    Brief.findByIdAndUpdate(req.params.id, req.body.brief, function(err, updatedBrief){
        if(err){
          res.redirect("/briefs");  
        } else {
            //redirect somewhere
            res.redirect("/briefs/" + req.params.id);
        }
    });
});

//DESTROY
router.delete("/:id", middleware.checkBriefOwnership, function(req, res){
    Brief.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/briefs");
        } else {
            res.redirect("/briefs");
        }
    });
});

module.exports = router;