const mongoose = require('mongoose');
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("./auth/auth");
const UserSchma = mongoose.Schema({
    fullName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,
    },
    salt:{
        type:String,
    }
    ,
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    }, 
 profileImageURL: {
        type: String,
        default: "../public/default.png",
      }
},{timestamps:true})

UserSchma.pre("save", function (next) {
    const user = this;
  
    if (!user.isModified("password")) return;
  
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");
    user.password = hashedPassword;
    user.salt = salt;
    next();
})

UserSchma.static('matchPasswordAndGenerateToken',async function(email,password){
  
    const user = await this.findOne({ email });
    
    if (!user) throw new Error("User not found!");

    const salt = user.salt;
    console.log(salt)
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
      console.log(userProvidedHash===hashedPassword)
      if (hashedPassword !== userProvidedHash)
      throw new Error("Incorrect Password");
    
    const token = createTokenForUser(user);
    console.log(token)
    return token;
})
const user = mongoose.model("User",UserSchma)

module.exports = user;