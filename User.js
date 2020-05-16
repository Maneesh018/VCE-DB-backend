const express = require('express');
//const router = express.Router();
const userController = require("./../controllers/userController");
const controllers=require("./../controllers/appController")
const appConfig = require("./../config/appConfig")
const mid1=require("./../middlewares/auth")
var cors=require('cors');
var app=express()
let setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}`;
    app.use(cors())
    app.post(`${baseUrl}/users/signup`,userController.signUpFunction);
    app.post(`${baseUrl}/users/login`,userController.loginFunction);
    app.post(`${baseUrl}/logout/:authToken`,mid1.isAuthorized, userController.logout);
    app.post(baseUrl+'/query/create/',controllers.createquery);
    app.post(baseUrl+'/solution/create/:queryId',controllers.createsolution)
    app.get(baseUrl+'/query/all/',controllers.getallqueries);
    app.get(baseUrl+'/query/all/mine/:userId',controllers.getuserqueries);
    app.get(baseUrl+'/solution/all/:queryId',controllers.getallsolutions);
    app.get(baseUrl+'/solution/:queryId/:solutionId',controllers.getsinglesolution);
    app.get(baseUrl+'/query/all/:tag',controllers.gettagqueries);
    app.put(baseUrl+'/solution/:queryId/:solutionId',controllers.editvotes);
      
}
module.exports={
    setRouter:setRouter
}