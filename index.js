const mongoose=require("mongoose");
const express = require('express')
const appConfig=require('./config/appConfig')
const app=express()
const fs=require("fs");
const bodyParser=require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

let routesPath ="./routes"
fs.readdirSync(routesPath).forEach(function (file){

if(-file.indexOf('.js')){
    console.log("including the following file");
    console.log(routesPath+'/file');
    let route=require(routesPath + '/' + file);
    route.setRouter(app);
}
});


let modelspath='./models'
fs.readdirSync(modelspath).forEach(function (file){
if(-file.indexOf('.js')){
    require(modelspath+'/'+file)
}
})
app.get('/',(req,res)=>res.send("Hello World"))

app.listen(appConfig.port,()=>{
    
    console.log("Example app listening on port 3000");
    let db=mongoose.connect(appConfig.db.uri,{ useNewUrlParser: true });
    
    })
    
    mongoose.connection.on('error',function (err){
        console.log('database connection .error');
        console.log(err);
        })//end
        
        mongoose.connection.on('open',function (err){
        if(err){
            console.log('database error');
            console.log(err);
        }else{
            console.log('database connection open success');
        }
    })
    