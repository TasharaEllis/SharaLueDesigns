var Brief = require("../models/brief");
var Comment = require("../models/comment");
// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkBriefOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Brief.findById(req.params.id, function(err, foundBrief){
            if(err || !foundBrief){
                req.flash("error", "Brief not found");
                res.redirect("back");
            } else {
                //does user own campground?
                if(foundBrief.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
        
    } else {
        req.flash("error", "Please Loggin First!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                //does user own comment?
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
        
    } else {
        req.flash("error", "Please Loggin First!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}

module.exports = middlewareObj;