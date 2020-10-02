

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

//password detail
router.get('/',checkLogin, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser')
    res.redirect('dashboard')
   
  });
  
  router.get('/edit/:id',checkLogin, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser')
    var id=req.params.id;
    getPassDetail=passM.findOneAndUpdate(id)
  
     getPassDetail.exec(function(err,data1){
      if(err) throw err;
    getPassCat.exec(function(err,data){
       
      res.render('edit_password_detail' , { title: 'Password Management System',loginUser:loginUser,success:'',records:data,record:data1 });
  
      }) });
  
    });
  
    // post method of  password_detail/edit
  
    router.post('/edit/:id',checkLogin, function(req, res, next) {
      var loginUser=localStorage.getItem('loginUser')
      var id=req.params.id;
      var passcat=req.body.pass_cat;
      var project_name=req.body.project_name;
      var pass_details=req.body.pass_details
      passM.findOneAndUpdate(id,{passwordCategory:passcat,project_name:project_name,pass_details:pass_details}).exec((err)=>{
  
        if(err ) throw err;
    
  
      getPassDetail=passM.findOneAndUpdate(id)
    
       getPassDetail.exec(function(err,data1){
        if(err) throw err;
      getPassCat.exec(function(err,data){
         
        res.render('edit_password_detail' , { title: 'Password Management System',loginUser:loginUser,success:'Data  Updated Succesfully',records:data,record:data1 });
    
        }) });
    
      });
    })
  
    router.get('/delete/:id',checkLogin, function(req, res, next) {
  
      var loginUser=localStorage.getItem('loginUser')
      var id=req.params.id;
     var passdelete=passM.findOneAndDelete(id)
     passdelete.exec(function(err){
        if(err) throw err;
         res.redirect('/view-all-password');
    })
    })
    
  
  


module.exports = router;