var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Brief           = require("./models/brief"),
    Comment         = require("./models/comment"),
    User            = require("./models/user");
    
//requiring routes
var commentRoutes   = require("./routes/comments"),
    briefRoutes     = require("./routes/briefs"),
    indexRoutes     = require("./routes/index");

mongoose.connect("mongodb://localhost/design_brief");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "zoo da boo",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//express router   
app.use("/", indexRoutes);
app.use("/briefs", briefRoutes);
app.use("/briefs/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("SharaLueDesigns Server Has Started!");
});