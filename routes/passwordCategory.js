
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







router.get('/',checkLogin, function(req, res, next) {

    var loginUser=localStorage.getItem('loginUser')
    res.render('dashboard', { title: 'Password Management System',loginUser:loginUser ,msg:"" });
  });


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





//password category

router.get('/',checkLogin, function(req, res, next) {

    var loginUser=localStorage.getItem('loginUser')
     getPassCat.exec(function(err,data){
      if(err) throw err;
  res.render('password_category', { title: 'Password Management System',loginUser:loginUser,records:data });
  
  })
  })
  
  router.get('/delete/:id',checkLogin, function(req, res, next) {
  
    var loginUser=localStorage.getItem('loginUser')
    var passCatId=req.params.id;
   var passdelete=passCatM.findOneAndDelete(passCatId)
   passdelete.exec(function(err){
      if(err) throw err;
       res.redirect('/passwordCategory');
  })
  })
  
  router.get('/edit/:id',checkLogin, function(req, res, next) {
  
    var loginUser=localStorage.getItem('loginUser')
    var passCatId=req.params.id;
    //var updatePassCat=req.body.passwordCategory
   var getPassCatId= passCatM.findOneAndUpdate(passCatId)
   getPassCatId.exec(function(err,data)  {
      if(err) throw err;
     
      res.render('editPassCat', { title: 'Password Management System',loginUser:loginUser,records:data,success:"",errors:"" });
  })
  })
  
  
  router.post('/edit/',checkLogin, function(req, res, next) {
  
    var loginUser=localStorage.getItem('loginUser')
    var passCatId=req.body.id;
    var updatePassCat=req.body.passwordCategory
   var getPassCatIdp= passCatM.findOneAndUpdate(passCatId,{passord_category:updatePassCat})
   getPassCatIdp.exec(function(err,data)  {
      if(err) throw err;
      //console.log(data)
      res.redirect('/passwordCategory');
      //res.render('editPassCat', { title: 'Password Management System',loginUser:loginUser,records:data,success:"",errors:"",id:passCatId });
  })
  })

  module.exports = router;
  
  
  