const mongoose=require("mongoose");
const query=require('../models/query');
const querySchema=mongoose.model('query');
const solutions=require('../models/solution');
const solutionSchema=mongoose.model('solutions');
const response=require('../libs/responseLib');
const express=require('express');
const shortid=require('shortid');

let getallqueries=(req,res)=>{
 
    console.log("came into get all queries at backend")
    querySchema.find().sort({"created":-1})
    .select('-__v-_id')
    .lean()
    .exec((err,result)=>{

        if(err)
        {
            console.log(err)
            res.send(err)
        }
        else if(result == undefined || result == null || result ==''){
            console.log("no queries found")
            res.send("no queries found")
        }
        else{
            let apiresponse=response.generate("false","all queries fetched successfully","200",res)
            res.send(result)
        }
    })
}
let getuserqueries=(req,res)=>{
    console.log("came into get all queries at backend")
    querySchema.find({'userId':req.params.userId})
    .select('-__v-_id')
    .lean()
    .exec((err,result)=>{

        if(err)
        {
            console.log(err)
            res.send(err)
        }
        else if(result == undefined || result == null || result ==''){
            console.log("no queries found")
            res.send("no queries found")
        }
        else{
            let apiresponse=response.generate("false","all queries fetched successfully","200",res)
            res.send(result)
        }
    })
}
let gettagqueries=(req,res)=>{
 
    console.log("came into get all queries at backend")
    querySchema.find({'tag':req.params.tag})
    .select('-__v-_id')
    .lean()
    .exec((err,result)=>{

        if(err)
        {
            console.log(err)
            res.send(err)
        }
        else if(result == undefined || result == null || result ==''){
            console.log("no queries found")
            res.send("no queries found")
        }
        else{
            let apiresponse=response.generate("false","all queries fetched successfully","200",res)
            res.send(result)
        }
    })
}
let getsinglesolution=(req,res)=>{
    console.log("came into get all solutions at backend")
    solutionSchema.find({'queryId':req.params.queryId,'solutionId':req.params.solutionId})
    .select('-__v-_id')
    .lean()
    .exec((err,result)=>{
        if(err)
        {
            console.log(err)
            res.send(err)
        }
        else if(result == undefined || result == null || result ==''){
            console.log("no queries found")
            res.send("no queries found")
        }
        else{
            let apiresponse=response.generate("false","all queries fetched successfully","200",res)
            console.log(result)
            res.send(result)
        }
    })

}
let getallsolutions=(req,res)=>{
    console.log("came into get all solutions at backend")
    solutionSchema.find({'queryId':req.params.queryId}).sort({"upvotes":-1})
    .select('-__v-_id')
    .lean()
    .exec((err,result)=>{
        if(err)
        {
            console.log(err)
            res.send(err)
        }
        else if(result == undefined || result == null || result ==''){
            console.log("no queries found")
            res.send("no queries found")
        }
        else{
            let apiresponse=response.generate("false","all queries fetched successfully","200",res)
            console.log(result)
            res.send(result)
        }
    })


}

let createquery=(req,res)=>{

    let todays=Date.now()
    let localdate=new Date(todays)
    let queryIds=shortid.generate()
    console.log("this is userid :" +req.body.userId);
    let newquery=new querySchema({
        userId:req.body.userId,
        username:req.body.username,
        queryId:queryIds,
        query:req.body.query,
        tag:req.body.tag,
        created:localdate
    })
    newquery.save((err,result)=>{
          
        if(err)
        {
            console.log(err)
            res.send(err)
        }
        else{
            res.send(result)
        }

    })
}
let createsolution=(req,res)=>{
    let today=Date.now()
    let solutionIds=shortid.generate()
    let newsolution=new solutionSchema({
       userId:req.body.userId,
       username:req.body.username,
       queryId:req.params.queryId,
       solutionId:solutionIds,
       solution:req.body.solution,
       upvotes:req.body.upvotes,
       created:today

    })
    newsolution.save((err,result)=>{
        if(err)
        {
            console.log(err)
            res.send(err)
        }
        else{
            console.log(result)
            res.send(result)
        }
    })
}
let editvotes=(req,res)=>{

    let options=req.body;
    console.log(options);
    solutionSchema.findOneAndUpdate({'queryId':req.params.queryId,'solutionId':req.params.solutionId},options,{multi:true}).exec((err,result)=>{
     if(err)
     {
         console.log(err)
         res.send(err)
     }
     else if(result== undefined||result==null||result==''){
         console.log("no list found")
         res.send("no list found")
     }
     else{
         console.log("result sent from editlist")
         res.send(result)
     }
 
 
    })
 }
module.exports={
    getallqueries:getallqueries,
    getallsolutions:getallsolutions,
    createquery:createquery,
    createsolution:createsolution,
    getsinglesolution:getsinglesolution,
    editvotes:editvotes,
    gettagqueries:gettagqueries,
    getuserqueries:getuserqueries

}