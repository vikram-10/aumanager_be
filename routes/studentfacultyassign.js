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

router.put("/",async function(req,res){
   let token=req.header('token');
   jwt.verify(token, process.env.SECRET,async function(err, decoded) {
       try{
        let client=await mongoClient.connect(url);
        let db=client.db('aumanager');
        let facultyUpdate=await db.collection('users').findOneAndUpdate({_id:ObjectId(req.body.facultyId)},{$push:{students:req.body.studentId}});
        let studentUpdate=await db.collection('users').findOneAndUpdate({_id:ObjectId(req.body.studentId)},{$push:{faculties:req.body.facultyId}});
        res.json({
            status:1
        });
       }
       catch(err){
            console.log(err);
       }
  });
});



module.exports=router