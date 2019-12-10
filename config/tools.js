const bcrypt=require("bcryptjs");
const tools = {
    enBcrypt(password){
       var salt = bcrypt.genSaltSync(10)
       var hash = bcrypt.hashSync(password,salt);
       return hash;
    },
    comparePassword(password,userPassword){
        return bcrypt.compareSync(password,userPassword)
    }
}
module.exports=tools;