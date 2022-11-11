var express = require('express');
var User = require('../models/user.model');
var router = express.Router();

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


router.post('/add', function(req, res, next) {
  let newUser = new User({...req.body});
  newUser.save(function(err, newUser){
    if(err){
      res.send({message: err.message})
    }else{
      res.setHeader('Content-Type', 'application/json');
      res.send({message:'User saved successfully', newUserObj :  newUser});
    }
  });

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
