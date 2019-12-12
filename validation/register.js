const valiadator = require('validator');
const isEmpty = require('./is-empty');
module.exports=function valiadatorRegisterInput(data){
    let errors={};
    if(!valiadator.isLength(data.name,{min : 2,max : 30})){
        errors.name = '名字长度不能小于两位，不能超过30位'
    }
    return {
        errors,
        isValid:isEmpty(errors)
    }
}