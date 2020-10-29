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
const { route } = require('./facultyclearance');
let url=process.env.URL
router.use(cookieParser());
router.use(cors({
    origin:"*"
}))

router.get("/",async function(req,res){
    console.log("In Get route");
   let token=req.header('token');
   jwt.verify(token, process.env.SECRET,async function(err, decoded) {
       try{
        let facultyEmails=[];
           let count=0;
        let userEmail=decoded.data;
        let client=await mongoClient.connect(url);
        let db=client.db('aumanager');
        let user=await db.collection('users').find({email:userEmail});
        let forumItems=await db.collection('forum').find().toArray();
        console.log(forumItems);
        res.json(forumItems);
       }
       catch(err){
            console.log(err);
       }
  });
});

router.post("/",async function(req,res){
    console.log("In post route");
    let token=req.header('token');
    jwt.verify(token, process.env.SECRET,async function(err, decoded) {
        try{
         let facultyEmails=[];
            let count=0;
         let userEmail=decoded.data;
         let client=await mongoClient.connect(url);
         let db=client.db('aumanager');
         let user=await db.collection('users').findOne({email:userEmail});
         let dataIn={
            "name": `${user.fname} ${user.lname}`,
            "email":`${user.email}`,
            "content": req.body.content
         }
         let updatedItem=await db.collection('forum').insertOne(dataIn);  
         let forumItems=await db.collection('forum').find().toArray();       
         res.json(forumItems);
        }
        catch(err){
             console.log(err);
        }
   });
 });


module.exports=router;