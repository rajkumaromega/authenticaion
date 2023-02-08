//jshint esversion:6
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



const encrypt =require('mongoose-encryption');
const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const UserSchema = new mongoose.Schema({

    email:String,
    password:String
})

const secret = "iloveyousiri"
UserSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']})



const user = mongoose.model('user',UserSchema);

app.get("/",function(req,res){
    res.render("home");

})
app.get("/login", function(req,res){
    res.render("login");
})
app.get("/register", function(req,res){
    res.render("register")
})

app.post('/register',function(req,res){
     const userOne = new user({
        email:req.body.username,
        password:req.body.password
     })

     userOne.save(function(err){
        if(err){
            return handleError(err);
        }
        else{
            res.render("secrets");
        }
     })
})


app.post('/login',function(req,res){
    user.findOne({email:req.body.username},function(err,results){
        if(err){
            console.log(err);
        }
        else{
            if(results){
                if(results.password=== req.body.password){
                    res.render("secrets")
                }
            }
        }     
    })
})


app.listen(3000, function(err){
    if(err){
        console.log("error in server");
    }
    else{
        console.log("server listening at port 3000");
    }
})