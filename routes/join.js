var express = require('express');

var bcrypt=require('bcryptjs');
var router = express.Router();
const { check, validationResult } = require('express-validator');

var jwt = require('jsonwebtoken');

var userM=require('../module1/user');


var passCatM=require('../module1/password_category');
var passM=require('../module1/add_password');

var getPassCat=passCatM.find({})
var getAllPass=passM.find({})


if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}








function checkEmail(req,res,next){

    var email=req.body.email;
    
   var checkexemail= userM.findOne({email:email});
  
   checkexemail.exec((err,data)=>
   {
     if(err)
     {
       throw err;
     }
  
     if(data)
  {
      return res.render('signup', { title: 'Password Management System', msg:'Email Already Exist' });
  }
  next();
  
   })
    
  }
  
  
  function checkUname(req,res,next){
  
    var username=req.body.uname;
    
   var Uname= userM.findOne({username:username });
  
   Uname.exec((err,data)=>
   {
     if(err)
     {
       throw err;
     }
  
     if(data)
  {
      return res.render('signup', { title: 'Password Management System', msg:'User NameAlready Exist' });
  }
  next();
  
   })
    
  }
  
  function checkLogin(req,res,next)
{  
  var userToken=localStorage.getItem('userToken')
  try{
    var decoded=jwt.verify(userToken,'loginToken')

  }
  catch{
res.redirect('/')
  }
  next();
}
 // view password 
 

  
  
  router.get('/',checkLogin, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser')
   
    var options = {
     
      offset:   1, 
      limit:    2
  };
  passM.aggregate([
    {
      $lookup:
        {
          from: "password_categories",
          localField: "password_category",
          foreignField: "passord_category",
          as: "pass cat details"
        }
   },
   {$unwind : "$pass cat details"}
 ]).exec((err,data)=>{
     if(err)throw err;
     console.log(data)
     res.send(data);
 })
    })

  
 

module.exports = router;