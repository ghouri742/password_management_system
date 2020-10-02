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



/* GET home page. */
router.get('/', function(req, res, next) {

  var loginUser=localStorage.getItem('loginUser')
if(loginUser) 
{ res.redirect('./dashboard');   }
else{
  res.render('index', { title: 'Password Management System',msg:"" });
}
});
router.get('/dashboard',checkLogin, function(req, res, next) {

  var loginUser=localStorage.getItem('loginUser')
  res.render('dashboard', { title: 'Password Management System',loginUser:loginUser ,msg:"" });
});


router.post('/', function(req, res, next) {

var username=req.body.uname;
var pass=req.body.passindex;

var checkU=userM.findOne({username:username});
checkU.exec((err,data)=>{
if(err)throw err;
var getUserId=data._id;


var getpassword=data.password;
if(bcrypt.compareSync(pass,getpassword)){

var token=jwt.sign({userId:getUserId},'loginToken')
localStorage.setItem('userToken',token)
localStorage.setItem('loginUser',username)
res.redirect('/dashboard')
}
else{
res.render('index', { title: 'Password Management System',msg:"Invalid User and Passord" });
}
 });
});



router.get('/signup', function(req, res, next) {

  var loginUser=localStorage.getItem('loginUser')
  if(loginUser) 
  { res.redirect('./dashboard');   }
  else{

  res.render('signup', { title: 'Password Management System', msg:"" });
  }
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




router.post('/signup',checkUname,checkEmail, function(req, res, next) {

  // var username=req.body.uname,
  //  const email=req.body.email,
  // var password=req.body.password,
  // var confpassword=req.body.confpassword,

  var username=req.body.uname;
  var email=req.body.email;
  var password=req.body.password;
  var confpassword=req.body.confpassword;
  if(password!=confpassword) {
    res.render('signup', { title: 'Password Management System', msg:'Kindly Match Your Password' });
  }

   else{
var password=bcrypt.hashSync(req.body.password,10)
  var userDetails= new userM({

    username:username,
    email:email,
    password:password,
  });


userDetails.save((err,doc)=>{
  if(err) throw err;
  res.render('signup', { title: 'Password Management System', msg:'User Registerd Successfully' });
})  
   }
})


// router.get('/add-new-password', function(req, res, next) {

//   res.render('addNewPassword', { title: 'Password Management System' });
// });


// router.get('/view-all-password',checkLogin, function(req, res, next) {
//   var loginUser=localStorage.getItem('loginUser')
//   var perPage = 1;
//   var page =  1;


//   getAllPass.find({})
//   .skip((perPage * page) - perPage)
//   .limit(perPage).exec((err,data)=>{
//     if(err) throw err;

//     passM.countDocuments({}).exec((err,count)=>{ 
//     res.render('view-all-password', { title: 'Password Management System',loginUser:loginUser,
//     records:data,
//     current: page,
//     pages: Math.ceil(count / perPage) 
//     });
//   })
// })
// });



router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken')
localStorage.removeItem('loginUser')
res.redirect('/')

})

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
module.exports = router;
