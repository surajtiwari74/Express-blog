const { Router} = require('express');
const user = require('../model/user.model')

const route = Router();

route.get('/signin',(req,res)=>{
    
    res.render('signin')
})
route.get('/signup',(req,res)=>{
    
    res.render('signup')
})
route.post('/signup',async(req,res)=>{
       
        const { fullName, email, password } = req.body;
       try{
        await user.create({
            fullName,
            email,
            password,
          });
       }catch(err){
              return res.render("signup", {
                error: "Email already exists"
              })}      
   return res.redirect("/user/signin");  
})
route.post('/signin',async(req,res)=>{
    const { email, password } = req.body;
    try {
      const token = await user.matchPasswordAndGenerateToken(email, password);
  
      return res.cookie("token", token).redirect("/");
    } catch (error) {
      return res.render("signin", {
        error: "Incorrect Email or Password",
      });
    }
})
route.get('/logout',(req,res)=>{
    res.clearCookie('token')
    res.redirect('/')
})

module.exports = route;