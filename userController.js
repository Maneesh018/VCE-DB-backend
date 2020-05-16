const mongoose = require('mongoose');
var User=require('../models/user')
const UserModel = mongoose.model('User')
var Auth=require('../models/Auth')
const AuthModel=mongoose.model('Auth')
var cookies=require('cookies');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const passwordLib = require('./../libs/generatePasswordLib');
const token = require('../libs/tokenLib')


/* Models */
// start user signup function 
let useridvalue;
let signUpFunction = (req, res) => {
    let validateUserInput=()=>{
        return new Promise((resolve, reject)=>{
         
            if(req.body.email)
            {
                if(!validateInput.Email(req.body.email))
                {
                    let apiResponse=response.generate(true,'Email Does not met the requirement',400,null)
                    reject(apiResponse)
                }
                else if(check.isEmpty(req.body.password)){
                    let apiResponse=response.generate(true,'"password" is missing')
                    reject(apiResponse)
                }
                else{
                    resolve(req)
                }
            }
            else{
                logger.error('Field Missing During User Creation','userController:createUser()',5)
                let apiResponse=response.generate(true,'one or More Parameter is missing',400,null)
                reject(apiResponse)
            }
        })
    }
    let createUser=()=>{
        return new Promise((resolve,reject)=>{
            UserModel.findOne({email:req.body.email})
            .exec((err,retrievedUserDetails)=>{
             
                if(err){
                    logger.error(err.message,'userController:createUser',10)
                    let apiResponse=response.generate(true,'Failed To Create User',400,null)
                     reject(apiResponse)
                }
                else if(check.isEmpty(retrievedUserDetails)){
                    console.log(req.body)
                    let newUser=new UserModel({
                     userId:shortid.generate(),
                     firstName:req.body.firstName,
                     lastName:req.body.lastName||'',
                     email:req.body.email.toLowerCase(),
                     mobileNumber:req.body.mobileNumber,
                     password:passwordLib.hashpassword(req.body.password),
                     apiKey:req.params.apiKey||req.query.apiKey||req.body.apiKey,
                     createdOn:time.now()
                    })
                    newUser.save((err,newUser)=>{
                        if(err){
                            console.log(err)
                            logger.error(err.message,"userController:CreateUser",10)
                            let apiResponse=response.generate(true,'Failed To Create User',400,null)
                            reject(apiResponse)
                        }
                        else{
                            let newUserObj=newUser.toObject();
                            resolve(newUserObj)
                        }
                    })
                }
                else{

                    logger.error('User Already Present',"userController:CreateUser",4);
                    let apiResponse=response.generate(true,'Failed To Create User',403,null)
                    reject(apiResponse)
                }
            })
        })
    }
    validateUserInput(req,res)
    .then(createUser)
    .then((resolve)=>{
        delete resolve.password
        res.header("Access-Control-Allow-Origin", "*");

        let apiResponse=response.generate(false,"user created",200,resolve)
        res.send(apiResponse)
    })
    .catch((err)=>{
        console.log(err);
        res.send(err);
    })
}// end user signup function 

// start of login function 
let loginFunction = (req, res) => {
    
    let findUser=()=>{
        console.log("find user");
        return new Promise((resolve,reject)=>{
                 console.log("entered promise "+req.body.email +' '+req.body.password)
            if(req.body.email){
                console.log("entered if loop")
                UserModel.findOne({email:req.body.email},(err,userDetails)=>{
                   if(err)
                   {
                       console.log("finding usermodel")
                       console.log(err)
                       logger.error('Failed to retrieve User Data',"userController: findUser()",10)
                       let apiResponse =response.generate(true,"Failed To Find User Details",500,null)
                       reject(apiResponse)
                   }
                   else if(check.isEmpty(userDetails)){
                       console.log("entered empty")
                    logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)

                   }
                   else{
                    console.log("entered resolve")
                    logger.info('User FOund','userController: findUser()',10)
                       resolve(userDetails)

                   }
                })
            }
            else {
                let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
                reject(apiResponse)
            }

        })
    }
    let validatePassword = (retrievedUserDetails) => {
        console.log("validatePassword");
        console.log(retrievedUserDetails);
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password,retrievedUserDetails.password, (err, isMatch) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                } else if (isMatch) {
                    var Cookies = new cookies(req, res)
                    Cookies.set('userid',retrievedUserDetails.userId);
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.modifiedOn
                    resolve(retrievedUserDetailsObj)
                } else {
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                    reject(apiResponse)
                }
            })
        })
    }
    let generateToken=(userDetails)=>{
        console.log('generate token');
        return new Promise((resolve,reject)=>{
              
            token.generateToken(userDetails,(err,tokenDetails)=>{
                     
                if(err){
                    console.log(err)
                    let apiResponse=response.generate(true,'failed to generate token',500,null)
                    reject(apiResponse)
                }
                else{
                   tokenDetails.userId=userDetails.userId
                   tokenDetails.userDetails=userDetails
                   resolve(tokenDetails)
                }
              
            })

        })
    }

let saveToken=(tokenDetails)=>{
     console.log("save token")
    return new Promise((resolve,reject)=>{
        AuthModel.findOne({userId:tokenDetails.userId},(err,retrievedTokenDetails)=>{

           if(err)
           {
               console.log(err.message,'userController:saveToken',10)
               let apiResponse=response.generate(true,'Failed To Generate Token',500,null)
               reject(apiResponse)
            }
            else if(check.isEmpty(retrievedTokenDetails)){
                let newAuthToken=new AuthModel({
                    userId:tokenDetails.userId,
                    authToken:tokenDetails.token,
                    tokenSecret:tokenDetails.tokenSecret,
                    tokenGenerationTime:time.now()
                })
                newAuthToken.save((err,newTokenDetails)=>{
                    if(err){
                        console.log(err)
                        logger.error(err.message,'userController:saveToken', 10)
                        let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                        reject(apiResponse)
                    } else {
                        console.log("this is "+newAuthToken.userId);
                        let responseBody = {
                            authToken: newTokenDetails.authToken,
                            userDetails: tokenDetails.userDetails
                        }
                        resolve(responseBody)
                    }   
                })
            }
            else{
                retrievedTokenDetails.authToken=tokenDetails.token
                retrievedTokenDetails.tokenSecret=tokenDetails.tokenSecret
                retrievedTokenDetails.tokenGenerationTime=time.now()
                retrievedTokenDetails.save((err, newTokenDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'userController: saveToken', 10)
                        let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                        reject(apiResponse)
                    } else {
                        let responseBody = {
                            authToken: newTokenDetails.authToken,
                            userDetails: tokenDetails.userDetails
                        }
                        resolve(responseBody)
                    }
                })
            }


        })
    })
}
findUser(req,res)
.then(validatePassword)
.then(generateToken)
.then(saveToken)
.then((resolve)=>{
    console.log("hi");
    let apiResponse=response.generate(false,'Login Successfull',200,resolve)
    res.status(200)
    res.send(apiResponse)  
})
.catch((err)=>{
    console.log("hello");

    console.log("error handler");
    console.log(err);
    res.status(err.status);
    res.send(err)
})

}


// end of the login function 


let logout = (req, res) => {
console.log("entered logout " )
    AuthModel.findOneAndRemove({userId:req.user.userId},(err,result)=>{
            
        if(err){
            console.log(err)
            let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true, 'Already Logged Out or Invalid UserId', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Logged Out Successfully', 200, null)
            res.send(apiResponse)
        }
      })
} // end of the logout function.
module.exports = {

    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    logout: logout
}// end exports