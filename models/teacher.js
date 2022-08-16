const mongoose = require('mongoose'); //importing mongoose

const teachersSchemaDefination = {
    name:{
        type: String,
        required: true
    },
    faculty:{
        type: String,
        required: true
    },
    contact:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        default: 5
    }
};

const teachersSchema = new mongoose.Schema(teachersSchemaDefination); //creating the mongoose scheama from the above defination

module.exports = mongoose.model('Teacher', teachersSchema); //Creatinga  a mongoose model