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
}))

router.get("/",async function(req,res){
   let token=req.header('token');
   jwt.verify(token, process.env.SECRET,async function(err, decoded) {
       try{
        let facultyEmails=[];
           let count=0;
        let userEmail=decoded.data;
        let client=await mongoClient.connect(url);
        let db=client.db('aumanager');
        let userDoubts=await db.collection('doubts').find({to:userEmail}).toArray();
        console.log(userDoubts);
        res.json(userDoubts);
       }
       catch(err){
            console.log(err);
       }
  });
});

router.put("/",function(req,res){
    let token=req.header('token');
    jwt.verify(token, process.env.SECRET,async function(err, decoded) {
        try{
         let facultyEmails=[];
            let count=0;
         let userEmail=decoded.data;
         let client=await mongoClient.connect(url);
         let db=client.db('aumanager');
         let userDoubt=await db.collection('doubts').findOneAndUpdate({_id:ObjectId(req.body.id)},{$set:{status:"Cleared"}});
        }
        catch(err){
console.log(err);
        }
    })
});

module.exports=router;