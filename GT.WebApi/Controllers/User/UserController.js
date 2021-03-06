var express=require('express');
var Router=express.Router();
var _service=require('gtservice');
var MyConsole=require('gtlogger');
var requestIp = require('request-ip');

const SecurityManager = require('gtsecuritymanager');
const ConfigurationManager = require('gtconfigurationmanager');
const NotificationManager = require('gtnotificationmanager');

Router.route('/')
  .get(function (req, res) {
       _service.UserService.getAll(function(result){
            if(result.error)
                res.status(500).json(result);
            else
                res.json(result);
       });
  })
  .post(function (req, res) {
      req.body.RegistrationIp=requestIp.getClientIp(req);
    _service.UserService.add(req.body,function(result){
        if(result.error)
            res.status(500).json(result);
        else
            res.json(result);
    });
  })
  .put(function (req, res) {
    _service.UserService.update(req.body,function(result){
        if(result.error)
            res.status(500).json(result);
        else
            res.json(result);
    });
  })
  .delete(function (req, res) {
    var result= _service.UserService.delete(req.body.id,function(result){
            if(result.error)
                res.status(500).json(result);
            else
                res.json(result);
       });
  });

  Router.route('/AddGoogleId')
  .put(function (req, res) {
    var result= _service.UserService.update(req.body,function(result){
            if(result.error)
                res.status(500).json(result);
            else
                res.json(result);
       });
  });
  
  Router.route('/AddFacebookId')
  .put(function (req, res) {
    var result= _service.UserService.update(req.body,function(result){
            if(result.error)
                res.status(500).json(result);
            else
                res.json(result);
       });
  });
  

  Router.route('/:id')
  .get(function (req, res) {
    _service.UserService.getById(req.params.id,function(result){
        if(result.error)
            res.status(500).json(result);
        else
            res.json(result);
    });
    
  });

Router.route('/GetByEmail/:Email')
  .get(function (req, res) {
    _service.UserService.getByEmail(req.params.Email,function(result){
            if(result.error)
                res.status(500).json(result);
            else
                res.json(result);
       });
  });
  
Router.route('/GetByEmailOrMobile/:EmailOrMobile')
  .get(function (req, res) {

        _service.UserService.getByEmailOrMobile(req.params.EmailOrMobile,function(result){
            if(result.error)
                res.status(500).json(result);
            else
                res.json(result);
        });
  });



  Router.route('/resend/VerificationEmail')
  .get(SecurityManager.extractUserFromToken,function (req, res) {

        _service.ProfileService.getById(req.body.UserId,function(result){
            if(result.error)
                res.json(result);
            else{

                var resendData={_id:req.body.UserId,EmailVerification:SecurityManager.generateRandomString(64)};

                _service.UserService.update(resendData,function(){
                });

                res.send({error:false,data:'New Verification token send to your Email.'});
                var mailOptions={
                    from:ConfigurationManager.getEmailConfiguration().auth.user,
                    to:result.data.Email,
                    subject:'Email verication',
                    text:'Welcome to the Application',
                    html:ConfigurationManager.getWebURI()+'verifyEmail/'+resendData.EmailVerification
                }

                NotificationManager.sendEmail(mailOptions);


            }
        });
  });

Router.route('/VerifyEmail/:Token')
  .get(function (req, res) {
    _service.UserService.getByEmailVerificationToken(req.params.Token,function(result){
        if(result.error)
            res.status(500).json(result);
        else
            res.json(result);
    });
  });

Router.route('/AddMobileNo')
.post(SecurityManager.extractUserFromToken,function (req, res) {
  
    _service.ProfileService.getById(req.body.UserId,function(result){

        if(result.error){
            res.json(result);
        }
        else{
            
            console.log(result);
            if(result.data.Status==3)
            {

                console.log(req.body.User.Mobile);
                console.log(req.body);

                _service.UserService.update({_id:result.data._id,TempMobile:req.body.User.Mobile,MobileVerificationOTP:SecurityManager.generateRandomString(6,/\d/)},function(result1){
                    if(result1.error)
                        res.json(result1);
                    else
                        res.json(result.data);
                });
            }
            else{
                res.json({error:true,data:'Mobile already Updated.'});
            }
        }
    });
});

Router.route('/verifyMobile')
.post(SecurityManager.extractUserFromToken,function (req, res) {
    _service.UserService.verifyMobile({_id:req.body.UserId,Mobile:req.body.User.Mobile,MobileVerificationOTP:req.body.User.MobileOtp},function(result){
        if(result.error)
            res.json(result);
        else{
            res.send(result.data);
        }
    });
});

Router.route('/Login')
.post(function (req, res) {
    console.log(req.body);
    _service.UserService.login(req.body,function(result){
        if(result.error)
            res.status(500).json(result);
        else{
            var claims={Id:result.data._id}
            res.send({Token:SecurityManager.createToken(claims)});
        }
    });
});

Router.route('/Logout')
.post(function (req, res) {
    res.json({});
});



/* Manage Account Password*/

  Router.route('/SetPassword')
  .post(SecurityManager.extractUserFromToken,function (req, res) {
        if(req.body.Password==undefined || req.body.Password == null || req.body.Password ==""){
            res.status(500).json({error:true,data:'Unable to set Password.'});
        }
        else{
            var user={_id: req.body.UserId,Password:req.body.Password};

            console.log(user);

            _service.UserService.setPassword(user,function(result){
                if(result.error)
                    res.status(500).json(result);
                else{
                    res.send(result.data);
                }
            });
        }
  });
  
  Router.route('/ResetPassword')
  .post(SecurityManager.extractUserFromToken,function (req, res) {
      
        if(req.body.Password==undefined || req.body.Password == null || req.body.Password ==""){
            res.json({error:true,data:'Unable to set Password.'});
        }
        else{

            var user={_id:req.body.UserId,Password:req.body.Password,OldPassword:req.body.OldPassword}
            _service.UserService.resetPassword(user,function(result){
                if(result.error)
                    res.json(result);
                else{
                    res.send(result.data);
                }
            });
        }
  });

  //Send the 
  Router.route('/ForgotPassword/:EmailOrMobile')
  .get(function (req, res) {
    _service.UserService.forgotPassword(req.params.EmailOrMobile,function(result){
        res.json(result);
    });
  });

  Router.route('/RecoverPassword')
  .post(function (req, res) {
    _service.UserService.RecoverPassword(req.body,function(result){
            res.json(result);
       });
  });

  

  
  

module.exports=Router;