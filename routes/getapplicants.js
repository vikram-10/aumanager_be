var express = require('express');
var router=express.Router();
let mongo=require('mongodb');
let bodyParser=require('body-parser');
let bcrypt=require('bcrypt');
let jwt=require('jsonwebtoken');
let cookieParser=require('cookie-parser');
let mongoClient=mongo.MongoClient;
let ObjectId=require('mongodb').ObjectID;
let dotenv=require('dotenv');
dotenv.config();
let cors=require('cors');
let url=process.env.URL
router.use(cookieParser());
router.use(cors({
    origin:"*"
}));

router.get("/",async function(req,res){
    let token=req.header('token');
    jwt.verify(token, process.env.SECRET,async function(err, decoded) {
        try{
         let userEmail=decoded.data;
         let client=await mongoClient.connect(url);
         let db=client.db('aumanager');
         let applicants=await db.collection('users').find({status:"unapproved"}).toArray();
         res.json(applicants); 
        }
        catch(err){
             console.log(err);
        }
   });
 });

 router.put("/",async function(req,res){
    let token=req.header('token');
    jwt.verify(token, process.env.SECRET,async function(err, decoded) {
        try{
         let userEmail=decoded.data;
         let client=await mongoClient.connect(url);
         let db=client.db('aumanager');
         let applicants=await db.collection('users').findOneAndUpdate({email:req.body.email},{$set:{status:req.body.status}});
         res.json(applicants); 
        }
        catch(err){
             console.log(err);
        }
   });
 });

 module.exports=router;