require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy=require('passport-google-oauth20').Strategy;
const findOrCreate=require('mongoose-findorcreate');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(session({
    secret: 'thisismysecrect',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true }).then(() => console.log('DB connection successfull'));

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId:String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user,done){
    done(null,user.id);
});
passport.deserializeUser(function(id,done){
    User.findById(id)
    .then(user =>{
        done(null,user);
    })
    .catch(err => {
        done(err,null);
        window.location.href = 'error.html';

    });
});

passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:"https://spayx-y24j.onrender.com/auth/google/index",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb){
    console.log(profile.displayName);
    User.findOrCreate({googleId:profile.id},function(err,user) {
        return cb(err, user);
    });
}
));
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/login.html");
});
app.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));

app.get("/auth/google/index",passport.authenticate('google',{failureRedirect:'/login'}),
function(req,res){
    res.redirect('/index');
});

app.get("/index", function (req, res) {
    if (req.isAuthenticated()) {
        res.sendFile(__dirname + "/index.html");
    }
    else {
        res.redirect("/login.html");
    }
});
app.post("/login", function (req, res) {
    User.register({username: req.body.username}, req.body.password, function(err, user){
        if (err) {
          console.log(err);
          res.redirect("/login.html");
        } else {
          passport.authenticate("local")(req, res, function(){
            res.redirect("/index");
          });
        }
      });
});

app.use(express.static(__dirname));

app.listen(process.env.PORT || 3000, function () {
    console.log('server started on port 3000');
});