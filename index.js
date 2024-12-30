const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const cookiePaser = require('cookie-parser')
const blog = require('./model/blog.model')
let app = express();
const {
    checkForAuthenticationCookie,
  } = require("./Middleware/authentication");
app.set('view engine',"ejs");
app.set("views", path.resolve("./views"));
app.use(express.static(path.resolve("./public")));
app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(express.json());
 
app.use(checkForAuthenticationCookie("token"));
 app.get('/', async (req,res)=>{
      const allBlogs = await blog.find({});       
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
      });
})
app.use("/user",userRoute)
app.use("/blog",blogRoute)
app.use('/*',(req,res)=>{
    res.status(404).render('404')
})
    
mongoose.connect('mongodb://127.0.0.1:27017/blogify').then(()=>{
    console.log("mongodb is connected")
    app.listen("8000",()=>{

        console.log("app is running on the port 8000")
    })
}).catch((err)=>{
   console.log(err)
})
