    const express = require('express');
    const bodyParser = require('body-parser');
    const morgon = require('morgan');
    const mongoose = require('mongoose');
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcryptjs');
    const otpGenerator = require('otp-generator')
    const Customer = require('../Modules/customerModels');
    const config = require('../config');
    const checkAuth = require('../middleware/auth');
    const  blacklist = require('express-jwt-blacklist');
    const {validationResult } = require('express-validator');

    exports.signupCustomer = (req,res,next) =>{
        Customer.find({email:req.body.email})
        .then(resp =>{
            if(resp.length > 0){
                res.status(409).json({
                    errormessage:"Eamil already exit"
                })
            } else{
                Customer.find({mobile:req.body.mobile})
                .then(result =>{
                    if(result.length > 0){
                        res.status(409).json({
                            errormessage: "Mobile already exit"
                        })
                    } else{
                        bcrypt.hash(req.body.data.password,12,(err,hash)=>{
                            if(err) {
                                res.status(409).json({
                                    errormessage:"password can't bcrypt"
                                })
                            } else{
                                const customer = new Customer({
                                _id:new mongoose.Types.ObjectId(),
                            }) 
                            customer.save().then(result =>{
                                res.status(200).json({
                                    message:'Customer data saved',
                                     data:customer,
                                  })
                            }).catch(err=>{
                                res.status(500).json({
                                    erreor:err
                                })
                            })
                            }
                        })
                    } 
                })
            }
        })
        .catch(err =>{
            res.status(500).json({
                error:err
            })
        })
    }
    
    exports.loginCustomer = (req,res,next)=>{
        var token;
        Customer.find({$or:[{email:req.body.email},{mobile:req.body.mobile}]})
        .then(resp =>{
            if(resp.length != 1){
            res.status(409).json({
                error:'Customer not exit in data'
            })
            } else{
                bcrypt.compare(req.body.password,resp[0].password,(err,sucess)=>{
                    if(!sucess){
                        res.status(409).json({
                            message:'Auth failed, check your password'
                        })
                    } else{
                        if(sucess){
                            token = jwt.sign({
                                email:resp[0].email,
                                id:resp[0]._id},
                                config.env.JWT_KEY,
                                {
                                 expiresIn: "10h"
                                 }
                                 )
                                 res.status(200).json({
                                     token:token,
                                     id:resp[0]._id,
                                     name:resp[0].name,
                                     email:resp[0].email,
                                     mobile:resp[0].monbile
                                    })
                        }
                    }
                })
            }
         
        }).catch(err =>{
            res.status(500).json({
                errormessage:'Auth failed, please check email,password'
            })
        })
    }
    
    exports.logoutCustomer =(req,res,next)=>{
        req.logout;
        return res.status(200).json({message:'Logout Success'});
    }
    
    exports.forgotPassword = (req,res,next)=>{
        Customer.find({$or:[{email:req.body.email},{mobile:req.body.mobile}]})
        .then(result=>{
            if(result.length != 1){
                res.status(409).json({
                    errormessage:'Customer not found'
                })
            } else{
                const otp = otpGenerator.generate(4, {digits:true, alphabets:false, upperCase: false, specialChars: false })
                res.status(200).json({
                    message:"OTP Send",
                    UserId: result[0]._id,
                    OTP: otp
                }) 
               
            }
        }).catch(err =>{
            res.status(500).json({
                error:err
            })
        })
    }

    exports.changePassword = (req, res, next) =>{
        const UserId = req.params.id;
        const updatedPassword = req.body.password;
         if(updatedPassword.match(/[0-9a-zA-Z@~!@#$%^&*()_+=|\]\-\[{}';/.,<>?":\\`]{6,}$/)){
        Customer.findById(UserId)
        .then(result=> {
            if(result == null){
                return res.status(404).json({
                    errorMessage: 'User does not exists in database'
                });
            }
            bcrypt.hash(req.body.password,10,(err, hashedPassword) => {
                if(err){
                    return res.status(500).json({
                        error : err
                    });
                 }
                else {
                    Customer.update({ _id: UserId }, {password: hashedPassword})
                    .then(doc => {
                        res.status(200).json({
                            message: "User password updated"
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            error : err
                        });
                    });
                 }
            })
        })
        .catch(err => {
            res.status(500).json({
                error : err
            });
        });
        }
        else{
        return res.status(500).json({
            errorMessage : 'invalid password'
            });
        }
    }

    exports.otpVerification =(req,res,next)=>{
       const mobile = req.body.mobileNumber;
       Customer.find({mobile})
       .then(result=>{
           if(result.length != 1){
            res.status(409).json({
            errorMessage:'User not exit'
        })
           } else{
            const otp = otpGenerator.generate(4, {digits:true, alphabets:false, upperCase: false, specialChars: false })
            res.status(200).json({
                message:'Do not share your OTP',
                OTP:otp
            })
   
           }
       })
       .catch(err=>{
           res.status(500).json({
               error:err
           })
       })

    }
    
