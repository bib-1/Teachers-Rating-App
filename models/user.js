const mongoose = require('mongoose'); //importing mongoose
const plm = require('passport-local-mongoose'); //package to handle serializing/deserializing objects to/from session store

const usersSchemaDefination = {
    username:{
        type: String
    },
    password:{
        type: String
    },
    oauthId:{
        type: String
    },
    oauthprovider:{
        type: String
    },
    created:{
        type: String
    }
};

const usersSchema = new mongoose.Schema(usersSchemaDefination); //creating the mongoose scheama from the above defination

usersSchema.plugin(plm); //to extend the functionality of schema

module.exports = mongoose.model('User', usersSchema); //Creatinga  a mongoose model