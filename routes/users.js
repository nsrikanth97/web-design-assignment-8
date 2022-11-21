var express = require('express');
var User = require('../models/user.model');
var router = express.Router();
const bcrypt = require('bcrypt');
const  RESPONSE_STATUS  = {
  SUCCESS : "SUCCESS",
  FAILURE : "FAILURE"
}
/* GET users listing. */
router.get('/getAll',async function(req, res, next) {
  try{
    let userList = await User.find();
    res.send({message:'User retrived successfully', users :  userList});
  }catch(err){
    console.log(err);
    res.send({message:'User retrive failed', error :  err.value});
  }
  
});


router.post('/singUp', function(req, res, next) {
  let newUser = new User({...req.body});
  newUser.save(function(err, newUser){
    if(err && err.keyPattern.email === 1 && err.code === 11000){
      res.send({message: 'UNIQUE_EMAIL_ERROR', status : RESPONSE_STATUS.FAILURE})
    }else if(err){
      res.send({message: err.message, status : RESPONSE_STATUS.FAILURE})
    }else{
      res.setHeader('Content-Type', 'application/json');
      res.send({status : RESPONSE_STATUS.SUCCESS , message:'Account created successfully', data :  newUser});
    }
  });
});

router.post('/login', async function(req, res, next) {
  try{
    const user = req.body;
    let existingUser = await User.where("email").equals(user.email).findOne();
    
    if(existingUser != null){
      const result = await bcrypt.compare(user.password, existingUser.password);
      if(result){
        res.send({message: "USER_LOGGED_IN_SUCCESSFULLY" , status : RESPONSE_STATUS.SUCCESS, data: existingUser});
      }else if(existingUser != null){
        res.send({message: "PASSOWORD_IS_NOT_CORRECT" , status : RESPONSE_STATUS.FAILURE});
      }
    }else{
      res.send({message: "USER_WITH_EMAIL_NOT_FOUND" , status : RESPONSE_STATUS.FAILURE});
    }
  }catch(err){
    res.send({message: err.message, status: RESPONSE_STATUS.FAILURE});
  }
});

router.put('/edit', async function(req, res, next) {
  try{
    const user = req.body;
    let existingUser = await User.where("email").equals(user.email).findOne();
    if(existingUser != null){
      existingUser.name = user.name;
      existingUser.password = user.password;
    }else{
      res.send({message: "User with the provided email ID is not available, please check the email and try again." , user});
    }
    await existingUser.save();
    res.send(existingUser);
  }catch(err){
    res.send({message: err.message});
  }
});

router.delete('/delete', async function(req, res, next) {
  try{
    console.log(req.query.email)
    const userEmail = req.query.email;
    let existingUser = await User.where("email").equals(userEmail).deleteOne();
    res.send({message: "User successfully deleted", existingUser});
  }catch(err){
    res.send({message: "User deltion failed"});
  }
});


module.exports = router;
