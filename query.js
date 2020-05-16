const mongoose=require('mongoose');
const Schema=mongoose.Schema
const queryschema=new Schema({
    userId:{
        type:String
    },
    username:{
        type:String
    },
    queryId:{
        type: String,
        unique:true
    },
    query:{
        type:String
        },
    tag:{
        type:String
    },
    created:{
        type:Date,
        default:Date.now
    }
})
mongoose.model('query',queryschema);