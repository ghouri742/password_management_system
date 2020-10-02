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


router.get('/add-new-password',checkLogin, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser')
  
    getPassCat.exec(function(err,data){
    if(err) throw err;
    else
    res.render('addNewPassword', { title: 'Password Management System',loginUser:loginUser,records:data,success:""  });
  
  
    })
   
  });
  // Add New Password Post
  router.post('/add-new-password',checkLogin, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser')
    var pass_cat=req.body.pass_cat
    var pass_details=req.body.pass_details
    var proj_name=req.body.project_name
    var add_pass_details=new passM({
      password_category:pass_cat,
      project_name:proj_name,
      password_detail : pass_details
    })
  
    add_pass_details.save(function(err,doc){
      getPassCat.exec(function(err,data){
        if(err) throw err;
        else
        res.render('addNewPassword', { title: 'Password Management System',loginUser:loginUser,records:data,success:"Password Details Inserted Successfuly "  });
    })  })  });
  

module.exports = router;