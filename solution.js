const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let solutionSchema = new Schema({
    userId:{
        type:String
    },
    username:{
        type:String
    },
    queryId: {
        type: String,
    },
    solutionId:{
        type:String,
    },
    solution: {
        type: String,
        default: ''
    },
    upvotes:{
        type:Number,
        default: 0,
    },
    voted:{
        type:Array,
        default:[1]
    },
    created:{
        type:Date,
        default:Date.now
    },
}
)
mongoose.model('solutions',solutionSchema );